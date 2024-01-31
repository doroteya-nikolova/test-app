import express from 'express';

export const insurances = [
  {
    id: '1',
    insurancePlanId: 'XYZ123',
    idNumber: 'ID123456',
    groupNumber: 'GRP789',
    policyHolder: {
      label: 'Mr.',
      firstName: 'John',
      middleInitial: 'M',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      birth: 'California',
      relation: 'Self',
      sex: 1, // Assuming 1 represents male
      homePhone: '555-1234',
      mobilePhone: '555-5678',
      address: {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Anytown',
        state: 'CA',
        country: 'USA',
        poBox: 'PO Box 789',
        zipCode: '12345'
      }
    },
    cardFrontId: 'front123',
    cardBackId: 'back456',
    cardFrontDocumentId: 'doc123',
    cardBackDocumentId: 'doc456',
    examInsurance: {
      eligibility: {
        status: 'Verified',
        statusUpdatedOn: '2024-01-22',
        lastStatus: 'Pending',
        lastStatusUpdatedOn: '2024-01-20'
      },
      authorization: {
        status: 'Approved',
        number: 'AUTH789',
        expirationDate: '2025-01-01',
      },
      examPrice: 150,
      patientOutOfPocket: 50,
      isLoading: false,
      hasError: false,
      errorMessage: ''
    },
    isPrimary: true,
    isActive: true
  },
  {
    id: '2',
    insurancePlanId: 'ABC456',
    idNumber: 'ID789012',
    groupNumber: 'GRP123',
    policyHolder: {
      label: 'Mrs.',
      firstName: 'Alice',
      middleInitial: 'L',
      lastName: 'Smith',
      dateOfBirth: '1985-08-22',
      birth: 'New York',
      relation: 'Spouse',
      sex: 2, // Assuming 2 represents female
      homePhone: '555-9876',
      mobilePhone: '555-5432',
      address: {
        addressLine1: '456 Oak St',
        addressLine2: 'Unit 7C',
        city: 'Othercity',
        state: 'NY',
        country: 'USA',
        poBox: 'PO Box 567',
        zipCode: '67890'
      }
    },
    cardFrontId: 'front789',
    cardBackId: 'back012',
    cardFrontDocumentId: 'doc789',
    cardBackDocumentId: 'doc012',
    examInsurance: {
      eligibility: {
        status: 'Verified',
        statusUpdatedOn: '2024-01-22',
        lastStatus: 'Verified',
        lastStatusUpdatedOn: '2024-01-21'
      },
      authorization: {
        status: 'Approved',
        number: 'AUTH456',
        expirationDate: '2024-12-31',
      },
      examPrice: 200,
      patientOutOfPocket: 75,
      isLoading: false,
      hasError: false,
      errorMessage: ''
    },
    isPrimary: false,
    isActive: true
  },
  {
    id: '3',
    insurancePlanId: 'PQR789',
    idNumber: 'ID345678',
    groupNumber: 'GRP456',
    policyHolder: {
      label: 'Mr.',
      firstName: 'David',
      middleInitial: 'S',
      lastName: 'Johnson',
      dateOfBirth: '1978-03-10',
      birth: 'Texas',
      relation: 'Child',
      sex: 1,
      homePhone: '555-3456',
      mobilePhone: '555-7890',
      address: {
        addressLine1: '789 Pine St',
        addressLine2: 'Apt 12D',
        city: 'Someville',
        state: 'TX',
        country: 'USA',
        poBox: 'PO Box 123',
        zipCode: '34567'
      }
    },
    cardFrontId: 'front345',
    cardBackId: 'back678',
    cardFrontDocumentId: 'doc345',
    cardBackDocumentId: 'doc678',
    examInsurance: {
      eligibility: {
        status: 'Pending',
        statusUpdatedOn: '2024-01-22',
        lastStatus: 'Pending',
        lastStatusUpdatedOn: '2024-01-20'
      },
      authorization: {
        status: 'Not Applicable',
        number: '',
        expirationDate: '',
      },
      examPrice: 100,
      patientOutOfPocket: 30,
      isLoading: false,
      hasError: false,
      errorMessage: ''
    },
    isPrimary: false,
    isActive: true
  }
];

const data = {
  billingType: 'billingType.insurance',
  insurances: [...insurances],
  workCompensations: [],
  personalInjuries: [],
  selfPayDetails: null
}

const app = express.Router();

export { app as routes };

app.get('/details', (req, res) => res.send(data));

app.post('/insurances', (req, res) => {
  const newItem = {
    id: generateId(),
    ...req.body
  }

  data.insurances.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/insurances', (req, res) => {
  const idToRemove = req.query.id;

  if (!idToRemove) {
    return res.status(400).json({ error: 'Missing insurance id parameter' });
  }

  const indexToRemove = data.insurances.findIndex(item => item.id.toString() === idToRemove.toString());

  if (indexToRemove === -1) {
    return res.status(404).json({ error: 'Insurance with not found' });
  }

  data.insurances.splice(indexToRemove, 1);

  res.status(201).json(data);
});

app.put('/insurances', (req, res) => {
  const newInsurances  = req.body;

  if (!newInsurances && !Array.isArray(newInsurances)) {
    return res.status(400).json({ error: 'Invalid insurances data' });
  }

  data.insurances = [...insurances];
  res.status(200).json(data);
});

app.put('/insurances/:id', (req, res) => {
  const idToUpdate  = req.params.id;

  if (!idToUpdate) {
    return res.status(400).json({ error: 'Missing insurance id parameter' });
  }

  const indexToUpdate = data.insurances.findIndex(item => item.id.toString() === idToUpdate.toString());

  if (indexToUpdate === -1) {
    return res.status(404).json({ error: 'Insurance not found' });
  }

  data.insurances[indexToUpdate] = {
    ...data.insurances[indexToUpdate],
    ...req.body
  };

  res.status(200).json(data);
})

app.post('/personal-injuries', (req, res) => {
  const newItem = {
    id: generateId(),
    ...req.body
  }
  data.personalInjuries.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/personal-injuries', (req, res) => {
  const idToRemove = req.query.id;

  if (!idToRemove) {
    return res.status(400).json({ error: 'Missing personal injury id parameter' });
  }

  const indexToRemove = data.personalInjuries.findIndex(item => item.id.toString() === idToRemove.toString());

  if (indexToRemove === -1) {
    return res.status(404).json({ error: 'Personal injury not found' });
  }

  data.personalInjuries.splice(indexToRemove, 1);

  res.status(204).end();
});

app.post('/work-compensations', (req, res) => {
  const newItem = {
    id: generateId(),
    ...req.body
  }
  data.workCompensations.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/work-compensations', (req, res) => {
  const idToRemove = req.query.id;

  if (!idToRemove) {
    return res.status(400).json({ error: 'Missing work compensation id parameter' });
  }

  const indexToRemove = data.workCompensations.findIndex(item => item.id.toString() === idToRemove.toString());

  if (indexToRemove === -1) {
    return res.status(404).json({ error: 'Work compensation not found' });
  }

  data.workCompensations.splice(indexToRemove, 1);

  res.status(204).end();
});

app.post('/actions', (req, res) => {
  const billingType = req.query.billingType as string;

  if (!billingType) {
    return res.status(400).json({ error: 'Missing billingType parameter' });
  }

  data.billingType = billingType;

  res.status(201).json(data);
});

function generateId() {
  return Math.random().toString(36).substring(7);
}