const axios = require("axios");

const { productsDao } = require("../Dao");
const { HttpStatus } = require("../Constants");
const { ThrowError } = require("../Handlers");
const { AMO_URL, AMO_TOKEN, AMO_INTEGRATION_ID } = require("../environments");

const addLead = async ({ phoneNumber, name, email, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  const dataToInsert = [
    {
      source_uid: AMO_INTEGRATION_ID,
      source_name: "Анти-фрод система",
      pipeline_id: product.pipelineId,
      _embedded: {
        contacts: [
          {
            name: name || "Нет имени",
            custom_fields_values: [
              {
                field_code: "PHONE",
                values: [
                  {
                    value: phoneNumber,
                  },
                ],
              },
              ...(email && [
                {
                  field_code: "EMAIL",
                  values: [
                    {
                      value: email,
                    },
                  ],
                },
              ]),
            ],
          },
        ],
      },
      metadata: {
        form_id: 1,
        form_name: "default",
        form_page: "Антифрод: заявка не прошла верификацию",
        form_sent_at: Math.floor(Date.now() / 1000) + 5 * 3600,
      },
    },
  ];

  const sendCodeResponse = await axios.post(
    `${AMO_URL}/api/v4/leads/unsorted/forms`,
    dataToInsert,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AMO_TOKEN}`,
      },
      validateStatus: () => true,
    }
  );

  const { _embedded } = sendCodeResponse.data;

  if (!_embedded) {
    throw new ThrowError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      `Can not get response from amo`
    );
  }

  const {
    unsorted: [lead],
  } = _embedded;

  return lead.uid;
};

const confirmLead = async ({ id, productId }) => {
  const product = await productsDao.getProduct(productId);

  if (!product) {
    throw new ThrowError(
      HttpStatus.NOT_FOUND,
      `Product not found for id ${productId}`
    );
  }

  return axios.delete(`${AMO_URL}/api/v4/leads/unsorted/${id}/decline`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AMO_TOKEN}`,
    },
    validateStatus: () => true,
  });
};

module.exports = { addLead, confirmLead };
