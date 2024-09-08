export default defineEventHandler(async (event) => {
  if (!process.dev) {
    return new Response("This endpoint is only available in development", {
      status: 403,
    });
  }
  await InvestmentSchema.deleteMany({});
  await InvestmentRegistrySchema.deleteMany({});

  const investments = [
    {
      name: "Ação da Empresa XYZ",
      registries: [
        {
          amount: 5000,
          type: "contribution",
          createdAt: new Date("01/03/2023"),
        },
        {
          amount: 10000,
          type: "income",
          createdAt: new Date("01/04/2023"),
        },
        {
          amount: 15000,
          type: "income",
          createdAt: new Date("01/05/2023"),
        },
        {
          amount: 15678,
          type: "income",
          createdAt: new Date("10/06/2023"),
        },
      ],
    },
    {
      name: "Fundo de Investimento ABC",
      registries: [
        {
          amount: 10000,
          type: "contribution",
          createdAt: new Date("15/04/2023"),
        },
        {
          amount: 44,
          type: "income",
          createdAt: new Date("01/04/2024"),
        },
        {
          amount: 51,
          type: "income",
          createdAt: new Date("01/05/2024"),
        },
        {
          amount: 58,
          type: "income",
          createdAt: new Date("01/06/2024"),
        },
        {
          amount: 47,
          type: "income",
          createdAt: new Date("01/07/2024"),
        },
        {
          amount: 5000,
          type: "contribution",
          createdAt: new Date("01/08/2024"),
        },
      ],
    },
    {
      name: "Tesouro Direto IPCA+",
      registries: [
        {
          amount: 15000,
          type: "contribution",
          createdAt: new Date("01/05/2023"),
        },
        {
          amount: 16800,
          type: "income",
          createdAt: new Date("01/05/2023"),
        },
      ],
    },
    {
      name: "Ação da Empresa ABC",
      registries: [
        {
          amount: 15678,
          type: "contribution",
          createdAt: new Date("10/06/2023"),
        },
        {
          amount: 16200,
          type: "income",
          createdAt: new Date("10/06/2023"),
        },
      ],
    },
  ];

  try {
    await InvestmentSchema.insertMany(
      investments.map(({ name }) => ({ name }))
    );
  } catch (error) {
    console.error({ error });
    return new Response("An error has occured while seeding investments", {
      status: 500,
    });
  }

  const investimentDocs = await InvestmentSchema.find();
  for (const doc of investimentDocs) {
    const registries = investments.find(
      (investiment) => investiment.name === doc.name
    )?.registries;

    if (registries) {
      await InvestmentRegistrySchema.insertMany(
        registries.map((registry) => ({
          ...registry,
          investmentId: doc._id,
          createdAt: new Date(),
        }))
      );
    }
  }
});
