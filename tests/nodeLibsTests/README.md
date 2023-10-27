

Test the functionality of the each node in the json files.

Value Checking

1) Load the json files using the json module in python. Each json is a  `NodePackage` definition in `src\editor\configTypes.ts`)
2) Get the each `NodeConfig` (definition in `src\editor\types\configTypes.ts`)
3) Get the python code using the function `nodeToCode` from the `src\editor\generators\python_generator`
4) Run the python code using the exec function
5) Check the output of the python code with the expected output

Metadata checking

For the image type, check the output with its metadata or the input with each metadata



