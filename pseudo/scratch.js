// highScore.js
import someFile from "./someFile.js";

export default function handler(event, context) {
	const highScore = new HighScore(event);
	highScore.save(() => {
		context.successful({id: highScore.id});
	});
}

// ----
export default function handler(event, context) {
	const character = new Character({id: event.characterId});
	character.move(event.move);
	character.save(() => {
		context.successful({id: highScore.id});
	});
}





































stepParameters = {
	"FunctionName": "SomeFunction",
	"Description": "This is some function. It does things.",
	"Handler": "/some/function.handler",
	"MemorySize": "128",
	"Role": ,
	"Timeout": context.parameters.timeout




const steps = new ConanSteps();
steps.dependencies({
	aws: AWS
});

steps.add("")

function step(conan, context, done) {
	const AWS = context.dependencies.aws;
}








// Conan Deployment Step
function findApiByName(context) {
  AWS.Lambda.findApiByName(name, (api) => {
    context.apiId = api.id;
    context.done(null);
  });
}

// How Steps Work
conan.steps.add(findApiByName);
conan.steps.before(findApiByName, findApi);
conan.steps.after(findApiByName, findName);
conan.steps.start();

------

// conan.aws.js
export default class ConanAws {
  constructor(conan) {
    conan.api = new ApiModule(conan);
    conan.deploy = new DeployModule(conan);
  }
}
// conan.js
import Conan from "conan";
import ConanAws from "conan-aws";

const conan = new Conan({
  directories: {
    lambdas: "lambdas"
  },
  aws: {
    bucket: "nico-test",
    //enhacement
    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
  }
});

conan.use(AwsLambda, AwsApi);





// THE EXAMPLE

const conan = new Conan();

conan.lambda("AssetShow", 	"/assets/show.js");
conan.lambda("AssetCreate", "/assets/create.js");
conan.lambda("AssetUpdate", "/assets/update.js");
conan.lambda("AssetDelete", "/assets/delete.js");
conan.lambda("AssetList", 	"/assets/list.py");

conan.deploy(callback);










    .runtime("nodejs") // defaults to nodejs
    .role("lambdaRole")
    .description("This is my Lambda!")
    .memorySize(0)
    .timeout(60)
    .publish(true) // defaults to true

conan
  .lambda("SecretAccountList", "/secret/account/list.handler")
    .runtime("nodejs")
    .role("lambdaRole")
    .description("This is my Lambda!")
    .memorySize(0)
    .timeout(60)
    .publish(true) // defaults to true



    conan.api.stage(stage => {
        stage.description = "some";
    });
    conan.api.stage()
        .description("");

    // Code: { /* required */
    //   S3Bucket: 'STRING_VALUE',
    //   S3Key: 'STRING_VALUE',
    //   S3ObjectVersion: 'STRING_VALUE',
    //   ZipFile: new Buffer('...') || 'STRING_VALUE'
    // },
    // FunctionName: 'STRING_VALUE', /* required */
    // Handler: 'STRING_VALUE', /* required */
    // Role: 'STRING_VALUE', /* required */
    // Runtime: 'nodejs | java8 | python2.7', /* required */
    // Description: 'STRING_VALUE',
    // MemorySize: 0,
    // Publish: true || false,
    // Timeout: 0

const api = conan.api("nico-test");
const stage = api.stage("test");
stage.description("blah");

api.cors({
  methods: "GET, OPTIONS",
  allowOrigin: "*",
  maxAge: "1205",
  allowCredentials: true,
  allowHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
  exposeHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key"
});

const resource = stage.get("/accounts/{id}");

resource.cors(corsOptions);

// in config file
conan.context.config("cors.something", 2); // returns 2
conan.config.cors = {
  allowedOrigin: "*"
}
conan.context.config("cors.something", 2); // returns 1


conan = new Conan({
	role: "AWSLambda"
});

conan
	.lambda("AccountShow", "./lambdas/accounts/show.js")
		.packages({knex: "1.0.4"})
	.lambda("AccountCreate", "./lambdas/accounts/create.js")
		.dependencies("./my_modules/**/*")
	.lambda("AccountUpdate", "./lambdas/accounts/update.js")
	.lambda("AccountDelete", "./lambdas/accounts/delete.js")
	.lambda("AccountList", "./lambdas/accounts/list.js")

conan
	.lambda("PlaylistShow", "./lambdas/playlists/show.py")
		.runtime("python2.7");

conan
	.api("Company 1"); // upsertApiStep
		.stage("production")
			.get("/playlists/{id}")
				.cast("id", Number)
				.lambda("PlaylistShow") // python
			.get("/users/{id}")
				.cast("id", Number)
				.lambda("AccountShow") // nodejs

conan.deploy();



		.get("/playlists/{id}")
			.cast("id", Number)
			.lambda("PlaylistShow") // python
		.get("/users/{id}")
			.cast("id", Number)
			.lambda("AccountShow") // nodejs

  .api("Company1")
		.stage("production")
		// Account Resources
			.get("/accounts/{id}")
				.cast("id", Number)
				.lambda("AccountShow")
			.post("/accounts")
				.lambda("AccountCreate")
			.put("/accounts/{id}")
				.cast("id", Number)
				.lambda("AccountUpdate")
			.delete("/accounts/{id}")
				.cast("id", Number)
				.lambda("AccountDelete")
			.get("/accounts")
				.lambda("AccountList")

conan.deploy(() => {

});


			https://myapi.com/accounts/3




		.stage("staging")
		.stage("development")






      .get("/accounts/{id}")
        .cast("id", "integer")
        .path("id", "identifiers")
        .header("Access-Token", "credentials")
        .header("Api-Key", "credentials")
        .queryString("page", "search")
        .lambda("AccountList");





















conan.deploy();


        conanContext.getConfig("cors", "defaultValue");

      stage.post("/accounts")
        .body("data")
        .header("Access-Token", "credentials")
        .header("Api-Key", "credentials")
        .queryString("page", "search")
        .lambda("/account/create.handler", "AccountCreate")
        .role("lambdas")
        .cors({
          methods: "GET, OPTIONS",
          allowOrigin: "*",
          maxAge: "1205",
          allowCredentials: true,
          allowHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
          exposeHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key"
        });

      stage.post("/accounts")
        .body("data")
        .header("Access-Token", "credentials")
        .header("Api-Key", "credentials")
        .queryString("page", "search")
        .lambda("/account/create.handler", "AccountCreate")
        .role("lambdas")
        .cors({
          methods: "GET, OPTIONS",
          allowOrigin: "*",
          maxAge: "1205",
          allowCredentials: true,
          allowHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
          exposeHeaders: "Content-Type,X-Amz-Date,Authorization,X-Api-Key"
        });
  });
});

conan.deploy(() => {
  console.log("All done.");
});
