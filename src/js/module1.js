const config = {
  apiUrl: 'demo.com',
};

function myFunction() {
  console.log('module1, myFunction');
}

export { config as conf, myFunction as foo };
