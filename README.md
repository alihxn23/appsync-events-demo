# Appsync Events Demo


## Getting Started

Clone the repo and run the following commands in the terminal to get started 

```bash
npm install
npm run dev
```

## Deploy with CDK

*Note - Make sure you have AWS CLI and CDK CLI installed and working. More details [here](https://docs.aws.amazon.com/cdk/v2/guide/prerequisites.html)*

- Navigate to the `cdk` directory and install pacakges 
  ```bash
  cd cdk
  npm install
  ```
- Deploy `Backend` stack
  ```bash
  cdk deploy Backend
  ```
- This would deploy the backend stack and output the user pool id, app client id, and appsync event api endpoint in the terminal. Paste these values in the `App.tsx` file
- Go back to the root directory and build the frontend
  ```bash
  cd ..
  npm run build
  ```
- Go again to the cdk directory and deploy the frontend stack
  ```bash
  cd cdk
  cdk deploy Frontend
  ```
- The frontend can take around 10-15 mins to deploy
