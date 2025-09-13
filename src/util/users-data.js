const userdata = [
  {
    "name": "Sarah Johnson",
    "sso-id": "1234567890",
    "role": "trainer"
  },
  {
    "name": "Michael Chen",
    "sso-id": "2345678901",
    "role": "trainee"
  },
  {
    "name": "Emily Rodriguez",
    "sso-id": "3456789012",
    "role": "trainee"
  },
  {
    "name": "David Kumar",
    "sso-id": "4567890123",
    "role": "trainer"
  },
  {
    "name": "Jessica Smith",
    "sso-id": "5678901234",
    "role": "trainee"
  },
  {
    "name": "Robert Patel",
    "sso-id": "6789012345",
    "role": "trainee"
  },
  {
    "name": "Amanda Thompson",
    "sso-id": "7890123456",
    "role": "trainer"
  },
  {
    "name": "Christopher Lee",
    "sso-id": "8901234567",
    "role": "trainee"
  },
  {
    "name": "Priya Sharma",
    "sso-id": "9012345678",
    "role": "trainee"
  },
  {
    "name": "James Wilson",
    "sso-id": "1098765432",
    "role": "trainer"
  },
  {
    "name": "Lisa Garcia",
    "sso-id": "2109876543",
    "role": "trainee"
  },
  {
    "name": "Kevin Martinez",
    "sso-id": "3210987654",
    "role": "trainee"
  },
  {
    "name": "Rachel Davis",
    "sso-id": "4321098765",
    "role": "trainer"
  },
  {
    "name": "Andrew Miller",
    "sso-id": "5432109876",
    "role": "trainee"
  },
  {
    "name": "Samantha Brown",
    "sso-id": "6543210987",
    "role": "trainee"
  },
  {
    "name": "Daniel Singh",
    "sso-id": "7654321098",
    "role": "trainer"
  },
  {
    "name": "Michelle Taylor",
    "sso-id": "8765432109",
    "role": "trainee"
  },
  {
    "name": "Ryan Anderson",
    "sso-id": "9876543210",
    "role": "trainee"
  },
  {
    "name": "Jennifer White",
    "sso-id": "1357924680",
    "role": "trainer"
  },
  {
    "name": "Alex Johnson",
    "sso-id": "1111111111",
    "role": "admin"
  }
];


export function getUserBySsoId(ssoId) {
  const user = userdata.find(user => user['sso-id'] === ssoId);
  return user || null;
};
