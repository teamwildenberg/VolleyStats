az group create --name TwVosDevEurRg01 --resource-group TwVosDevEurRg01 --location westeurope
az deployment group create --resource-group TwVosDevEurRg01 --template-file .\azure-resources.bicep --parameters .\azure-resources-parameters.json 
