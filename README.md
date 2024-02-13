<!-- starting server -->
1. npm start(normal start)
2. npm test (for testing) <!-- CI=true npm test  - for testing also -->
3. npm run cypress:open <!-- for testing through cypress -->

   **If you clone the project, run the npm install command before starting the application with npm start or npm run dev.**

npm update - for updating the dependencies of the project

<!-- when you clone project from github -->

1. git clone address
2. cd bloglist-frontend // go to cloned repository
3. rm -rf .git //remove the git configuration of the cloned application
4. npm install //install its dependencies
5. npm start

## Changes in connection with backend.
I had to create a new file (Blog App\Frontend\src\util\apiClient.js) and change the part in services files where baseUrl is used. I did it because frontend, when in container, didn't want to connect to backend. So I made those changes and used ENV instruction in Dockerfile.

### docker commands
build the image: docker build . -t blog-frontend
run it: docker run -p 8000:80 blog-frontend