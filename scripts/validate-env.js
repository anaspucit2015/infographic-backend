const dotenv = require('dotenv');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_COOKIE_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'FRONTEND_URL',
  'CORS_ORIGIN'
];

// Check if all required environment variables are set
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Error: The following required environment variables are missing:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  
  // Try to get values from .env.example
  try {
    const envExample = fs.readFileSync(path.resolve(__dirname, '../.env.example'), 'utf8');
    const exampleVars = envExample
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0]);
    
    console.log('\n💡 You can use the following template from .env.example:');
    missingVars.forEach(varName => {
      if (exampleVars.includes(varName)) {
        console.log(`${varName}=your_${varName.toLowerCase()}`);
      } else {
        console.log(`${varName}=your_value_here`);
      }
    });
  } catch (error) {
    console.error('\n⚠️  Unable to read .env.example file');
  }
  
  process.exit(1);
}

// Check if MongoDB URI is valid
if (process.env.MONGODB_URI) {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri.includes('<PASSWORD>')) {
    console.error('❌ Error: MONGODB_URI contains <PASSWORD> placeholder. Please replace it with your actual password.');
    process.exit(1);
  }
  
  // Simple format check
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Error: MONGODB_URI must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }
}

// Check JWT secret strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  Warning: JWT_SECRET is less than 32 characters. Consider using a longer secret for better security.');
  console.log('   You can generate a secure secret by running: node scripts/generate-secret.js');
}

// Check if in production environment
if (process.env.NODE_ENV === 'production') {
  const requiredInProduction = [
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'FRONTEND_URL',
    'CORS_ORIGIN'
  ];
  
  const missingInProduction = requiredInProduction.filter(varName => !process.env[varName]);
  
  if (missingInProduction.length > 0) {
    console.error('❌ Error: The following environment variables are required in production:');
    missingInProduction.forEach(varName => console.error(`- ${varName}`));
    process.exit(1);
  }
  
  // Check if using HTTPS in production
  if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
    console.warn('⚠️  Warning: FRONTEND_URL should use HTTPS in production for security.');
  }
  
  if (process.env.CORS_ORIGIN && !process.env.CORS_ORIGIN.startsWith('https://')) {
    console.warn('⚠️  Warning: CORS_ORIGIN should use HTTPS in production for security.');
  }
  
  if (process.env.JWT_COOKIE_SECURE !== 'true') {
    console.warn('⚠️  Warning: JWT_COOKIE_SECURE is not set to true in production. This is a security risk.');
  }
}

console.log('✅ Environment variables are valid');

// If we got here, all checks passed
process.exit(0);
