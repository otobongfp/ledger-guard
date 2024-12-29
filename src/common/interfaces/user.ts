interface User {
  publicKey: string;
  walletAddress: string;
  email: string;
  role: 'devops' | 'intern' | 'lead' | 'developer';
  approved: boolean;
}
