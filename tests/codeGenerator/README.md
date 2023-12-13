Todo:

* [ ] anaconda env


Test the functionality of the each node in the json files.

Value Checking

1) Load the json files including the build-in jsons and external jsons using the json module in python. Each json is a  `NodePackage` definition in `src\editor\types\configTypes.ts`)
2) Get the each `NodeConfig` (definition in `src\editor\types\configTypes.ts`)
3) import the requirement the lib
4) Get the python code using the function `nodeToCode` from the `src\editor\generators\python_generator`
5) Run the python code using the exec function
6) Check the output of the python code with the expected output
7) Test the exec[0]

Metadata checking

For the image type, check the output with its metadata or the input with each metadata
