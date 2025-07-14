const { verificationDao, productsDao } = require("../Dao");

const getAllStatsText = async () => {
  const verifications = await verificationDao.getAllVerifications();

  const total = verifications.length;
  const verified = verifications.filter((v) => v.isVerified).length;
  const uniquePhones = new Set(verifications.map((v) => v.phoneNumber)).size;

  return `📊 Статистика верификаций:\n
Количество запросов на верификацию: ${total}
Количество успешно пройденных верификаций: ${verified}
Количество уникальных номеров телефонов: ${uniquePhones}`;
};

const getProductsControlKeyboards = async () => {
  const products = await productsDao.getAllProducts();

  return products.map(({ id, isActive, name }) => [
    {
      text: isActive ? `✅ ${name}` : name,
      callback_data: isActive ? `offfraud:${id}` : `onfraud:${id}`,
    },
  ]);
};

const sendDailyEventsStat = async () => {
  const [lastDayVerifications, allProducts] = await Promise.all([
    verificationDao.getLastDayVerifications(),
    productsDao.getAllProducts(),
  ]);

  const productMap = new Map(
    allProducts.map((product) => [product.id, product])
  );

  const verificationsByProduct = lastDayVerifications.reduce(
    (groups, verification) => {
      const { productId } = verification;

      if (!groups.has(productId)) {
        groups.set(productId, []);
      }

      groups.get(productId).push(verification);

      return groups;
    },
    new Map()
  );

  const statsMessages = Array.from(verificationsByProduct.entries())
    .map(([productId, verifications]) => {
      const product = productMap.get(Number(productId));

      const totalRequests = verifications.length;
      const successfulVerifications = verifications.filter(
        (v) => v.isVerified
      ).length;
      const uniquePhones = new Set(verifications.map((v) => v.phoneNumber))
        .size;

      return [
        `Продукт: ${product.name}\n`,
        "----------------------------",
        `Количество запросов на верификацию: ${totalRequests}`,
        `Количество успешных верификаций: ${successfulVerifications}`,
        `Количество уникальных номеров: ${uniquePhones}`,
        "----------------------------",
        "",
      ].join("\n");
    })
    .filter(Boolean);

  return statsMessages.join("\n");
};

module.exports = {
  getAllStatsText,
  getProductsControlKeyboards,
  sendDailyEventsStat,
};
