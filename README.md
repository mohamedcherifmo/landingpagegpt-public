# LandingPageGPT

This project creates a cool landing page by utilizing GPT-4 (or GPT-3.5turbo) to transform campaign descriptions into engaging and visually appealing web content.


## How it works

It uses GPT-4 to generate sections based on the input, users are able to restructure and add their own sections and then using Vercel Edge and stream generate each component's Html.

## Running Locally

### Cloning the repository the local machine.

```bash
git clone https://github.com/mohamedcherifmo/landingpagegpt-public.git
```

### Creating a account on OpenAI to get an API key.

After cloning the repo, go to OpenAI to make an account

### Storing the API keys in .env

Create a file in root directory of project with env. And store your API key in it, ex. .local.env file.
Add the following:

```
DATA_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```


### Installing the dependencies.

```bash
npm install
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://github.com/mohamedcherifmo/landingpagegpt-public.git)