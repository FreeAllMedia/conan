# Conan: The Deployer Requirements

## Lambda Management

* List
* Create
* Update
* Delete

## Gateway API Management

aws apigateway put-method --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --authorization-type none

// create the integration method
aws apigateway put-integration --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --type AWS --integration-http-method GET --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:166191841105:function:ListAccounts/invocations --request-templates '{"application/json": "{\n  \"params\": {\n      \"header\": {\n          \"accessToken\": \"$input.params(\"Access-Token\")\"\n      }\n  },\n  \"data\": {}\n}"}'

aws apigateway put-integration-response --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --status-code 200 --selection-pattern "" --response-templates '{"application/json": ""}'
// another for each error or regex
aws apigateway put-integration-response --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --status-code 401 --selection-pattern "The access token provided is invalid." --response-templates '{"application/json": "{\n  \"errors\": [{\n      \"detail\": \"$input.path(\"$.errorMessage\")\"\n, \"title\": \"$input.path(\"$.errorType\")\"\n}]}"}'
// create the method response
aws apigateway put-method-response --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --status-code 200 --response-parameters {}
// every status returned
aws apigateway put-method-response --rest-api-id mufk0fvv87 --resource-id w08tf4 --http-method GET --status-code 401 --response-parameters {}

  aws lambda create-function \
  --region us-east-1 \
  --function-name ListAccounts \
  --role arn:aws:iam::166191841105:role/nsommidev-accounts-r-IamRoleLambda-467WKCOB6VVT \
  --handler lambdas/account/list.handler \
  --runtime nodejs \
  --profile default \
  --timeout 60 \
  --memory-size 512 \
  --code S3Bucket=fam-lambda-development,S3Key=accounts.zip

``` yaml
# conan.json
{
  "directories": {
    "lambdas": "/lambdas"
    "api": "/api"
  },
  "regions": [
    "us-east-1"
  ],
  "runtime": "nodejs",
  "profile": "default",
  "timeout": 60,
  "memorySize": 512
}
```

``` yaml
# /lambdas/conan.json
{
  "accounts": {
    "show": {
      "regions": [
        "us-west-1"
      ]
    }
  }
}
# /lambdas/accounts/conan.json
{
  "show": {
    "regions": [
      "us-west-1"
    ]
  }
}
```

``` yaml
# /lambdas/accounts/show.js
# /lambdas/accounts/show.json
{
  "regions": [
    "us-west-1"
  ]
}
# /lambdas/accounts/create.js
# /lambdas/accounts/create.json
```

``` yaml
# conan.api.json


# /lambdas/
# /api/nico-fam-accounts/api.json
# /api/nico-fam-accounts/stages/test.json

API -> DEPLOYMENT -> STAGE

API -> STAGE -> DEPLOYMENT

{
  "resources": {
    "/": {
      "accounts": {
        "methods": {
          "post": {
            "request": {
              "lambda": "accounts/create"
            },
            "response": {
              "selectionPattern": ""
            }
          },
          "get": "//list"
        },
        "{id}": {
          "methods": {
            "get": "//show",
            "put": "//update",
            "delete": "//delete"
          }
        }
      }
    }
  }
}




{
  "nico-fam-accounts-v2": {
    "test": {
      "resources": {
        "/": {
          "accounts": {
            "methods": {
              "post": {
                "request": {
                  "lambda": "accounts/create"
                },
                "response": {
                  "selectionPattern": ""
                }
              },
              "get": "//list"
            },
            "{id}": {
              "methods": {
                "get": "//show",
                "put": "//update",
                "delete": "//delete"
              }
            }
          }
        }
      }
    },
    "staging": {
      "resources": {
        "/": {
          "accounts": {
            "methods": {
              "post": {
                "request": {
                  "lambda": "accounts/create"
                },
                "response": {
                  "selectionPattern": ""
                }
              },
              "get": "//list"
            },
            "{id}": {
              "methods": {
                "get": "//show",
                "put": "//update",
                "delete": "//delete"
              }
            }
          }
        }
      }
    }
  }
}
```

### API / Stages

* List
* Create
* Update
* Delete

### REST API

*

#### Resources

##### Methods
