@minLength(1)
@maxLength(11)
@description('Define the project name or prefix for all objects.')
param projectName string = 'TwVos'

@minLength(3)
@maxLength(3)
@description('The environment to deploy to \'Dev\' | \'Poc\' | \'Prod\'.')
param environment string = 'Poc'

@minLength(3)
@maxLength(3)
@description('The Azure region as part of the name (\'Eur\' | \'...\').')
param region string = 'Eur'

@minLength(36)
@maxLength(36)
@description('Service Principal ID to set KeyVault deployment access policy')
param spnObjectId string = 'Eur'

var prefix = '${projectName}${environment}${region}'
var prefixLower = toLower(prefix)
var sig01Name = '${prefix}Sig01'
var sig01SkuName = 'Free_F1'
var sign01Tier = 'Free'
var st02Name = '${prefixLower}st02'
var st03Name = '${prefixLower}st03'
var log01Name = '${prefixLower}Log01'
var log01SkuName = 'Free'
var plan01Name = '${prefixLower}plan01'
var plan01SkuTier = 'Dynamic'
var plan01SkuName = 'Y1'
var plan01Capacity = 0
var plan01Family = 'Y'
var plan01Size = 'Y1'
var fun01Name = '${prefix}Fun01'
var ins01Name = '${prefix}Ins01'
var kv01Name = '${prefix}Kv01'


resource signalrName 'Microsoft.SignalRService/SignalR@2021-04-01-preview' = {
  name: sig01Name
  location: resourceGroup().location
  properties: {
    features: [
      {
        flag: 'ServiceMode'
        value: 'Serverless'
      }
      {
        flag: 'EnableConnectivityLogs'
        value: 'true'
      }
    ]
    tls: {
      clientCertEnabled: false
    }
  }
  sku: {
    name: sig01SkuName
    tier: sign01Tier
    capacity: 1
  }
  tags: {}
  dependsOn: []
}

resource fun01 'Microsoft.Web/sites@2021-01-01' = {
  name: fun01Name
  kind: 'functionapp'
  location: resourceGroup().location
  tags: {}
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: reference('microsoft.insights/components/${ins01Name}', '2015-05-01').InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference('microsoft.insights/components/${ins01Name}', '2015-05-01').ConnectionString
        }
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${st02.name};EndpointSuffix=core.windows.net;AccountKey=${listKeys(st02.id, st02.apiVersion).keys[0].value};'
  }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${st02.name};EndpointSuffix=core.windows.net;AccountKey=${listKeys(st02.id, st02.apiVersion).keys[0].value};'
        }
        {
          name: 'SensorDataStorageConnectionString'
          value: 'DefaultEndpointsProtocol=https;AccountName=${st03.name};EndpointSuffix=core.windows.net;AccountKey=${listKeys(st03.id, st03.apiVersion).keys[0].value}'
        }
        {
          name: 'AzureSignalRConnectionString'
          value: listKeys(signalrName.id, providers('Microsoft.SignalRService', 'SignalR').apiVersions[0]).primaryConnectionString
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: '${toLower(fun01Name)}89d6'
        }
      ]
    }
    serverFarmId: plan01.id
    clientAffinityEnabled: true
    httpsOnly: false
  }
  dependsOn: [
    appInsightsName
    plan01
    st02
    st03
  ]
}

resource log01 'Microsoft.OperationalInsights/workspaces@2020-10-01' = {
  name: log01Name
  location: resourceGroup().location
  properties: {
    sku: {
      name: log01SkuName
    }
    features: {
      enableLogAccessUsingOnlyResourcePermissions: false
    }   
  }
}


resource plan01 'Microsoft.Web/serverfarms@2021-01-01' = {
  name: plan01Name
  location: resourceGroup().location
  kind: ''
  tags: {}
  sku: {
    tier: plan01SkuTier
    name: plan01SkuName
    size: plan01Size
    family: plan01Family
    capacity: plan01Capacity
    
  }
  dependsOn: []
}

resource appInsightsName 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: ins01Name
  location: resourceGroup().location
  kind: 'web'
  tags: {}
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: log01.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  dependsOn: [
    log01
  ]
}

resource st02 'Microsoft.Storage/storageAccounts@2019-06-01' = {
  name: st02Name
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

resource st03 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: st03Name
  location: resourceGroup().location
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

resource st03Table 'Microsoft.Storage/storageAccounts/tableServices@2021-04-01' = {
  parent: st03
  name: 'default'
  properties: {
    cors: {
      corsRules: [
        {
          allowedOrigins: [
            '*'
          ]
          allowedMethods: [
            'PUT'
            'GET'
            'POST'
          ]
          maxAgeInSeconds: 0
          exposedHeaders: [
            '*'
          ]
          allowedHeaders: [
            '*'
          ]
        }
      ]
    }
  }
}

resource sto1TableSensorData 'Microsoft.Storage/storageAccounts/tableServices/tables@2019-06-01' = {
  parent: st03Table
  name: 'sensorData'
  dependsOn: [
    st03
  ]
}

resource keyvaultName 'Microsoft.KeyVault/vaults@2016-10-01' = {
  name: kv01Name
  location: resourceGroup().location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: reference(fun01.id, '2019-08-01', 'full').identity.principalId
        permissions: {
          keys: []
          secrets: [
            'get'
          ]
          certificates: []
        }
      }
      {
        tenantId: subscription().tenantId
        objectId: spnObjectId
        permissions: {
          keys: []
          secrets: [
            'set'
          ]
          certificates: []
        }
      }
    ]
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
  }
  dependsOn:[
    fun01
  ]
}
