# How to use the sample repo

## Use VSCode for Web - Azure 
1. `npm i`
2. Run `node index.js` to run the file host locally, expose the Port and set the visibility to Public
3. Rename `.env.sample` to `.env` and fill the variables with your values, `BASE_URL` is the public URL you just exposed. `PROJECT_URL` is the AI Foundry project URL.
4. Run `node geturl.js` to generate the URL for VSCode for Web - Azure, click the generated URL to open the template

## Run the sample locally
1. Copy `.env.template` into folder [./source/javascript] and rename it to `.env`, fill the variables with your values
2. In [./source/javascript] folder, run `node run_webserver.js` to start the sample server.
