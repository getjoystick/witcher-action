# Witcher API testing tool Github Action

Easy-to-use GitHub Action to use Witcher.

## Usage

Add `witcher-workflow` to the workflow of your application. The below example will run `witcher` with joystick config and will fail if any of the tests fail.

```yaml
name: API test

on:
  workflow_dispatch:

jobs:
  api-test:
    runs-on: ubuntu-latest
    name: API test
    steps:
      - name: Run Witcher API test
        uses: getjoystick/witcher-action@v0.1
        with:
          source: joystick
          apiKey: ${{ secrets.API_TEST_JOYSTICK_API_KEY }}
          configId: "root-config-id"
          # Specifying `secretJson` is optional, read `witcher` documentation for more info
          secretJson: ${{ secrets.API_TEST_SECRETS_JSON }}
```

To run `witcher` with local config, use the following example:

```yaml
name: API test

on:
  workflow_dispatch:

jobs:
  api-test:
    runs-on: ubuntu-latest
    name: API test
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Run Witcher API test
        uses: getjoystick/witcher-action@v0.1
        with:
          source: local
          localConfigPath: ./test/success/root-jsonplaceholder.json
          # Specifying `secretJson` is optional, read `witcher` documentation for more info
          secretJson: ${{ secrets.API_TEST_SECRETS_JSON }}
```

### Params

| Name         | Required | Description                                                                                             |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------- |
| `source`     | Yes      | Source of the config. Can be `local` or `joystick`                                                      |
| `secretJson` | No       | JSON string with secrets to use for the test. Required if `source` is `joystick` and config has secrets |

#### Joystick params

| Name       | Required if `source` is `joystick` | Description                                 |
| ---------- | ---------------------------------- | ------------------------------------------- |
| `apiKey`   | Yes                                | Joystick API key to get the test configs    |
| `configId` | Yes                                | Joystick Config ID with witcher root config |

#### Local params

| Name              | Required if `source` is `local` | Description                         |
| ----------------- | ------------------------------- | ----------------------------------- |
| `localConfigPath` | Yes                             | Path to the local root config file. |
