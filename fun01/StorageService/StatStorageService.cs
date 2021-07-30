namespace Tw.Vos.Fun01
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.Azure.Cosmos.Table;
    using Newtonsoft.Json;

    public class StatStorageService 
    {
        private CloudTable _table;
        public StatStorageService(){
            var storageConnectionString = Environment.GetEnvironmentVariable("SensorDataStorageConnectionString");
            var storageAccount = Common.CreateStorageAccountFromConnectionString(storageConnectionString);
            var tableClient = storageAccount.CreateCloudTableClient();
            _table = tableClient.GetTableReference(STORAGE_TABLE_NAME );
        }

        public const string STORAGE_TABLE_NAME = "sensorData";
        public const string DEFAULT_PARTITIONKEY = "DefaultFactory";


       public  async Task<StatDataEntity> FetchLastSensorState(string sourceAddress)
        {
            // Get the sensor data from storage.
            try{

                TableOperation retrieveOperation = TableOperation.Retrieve<StatDataEntity>(DEFAULT_PARTITIONKEY, sourceAddress);

                var tableExecution = await _table.ExecuteAsync(retrieveOperation);
                var sensorEntity = tableExecution.Result as StatDataEntity;

                if (sensorEntity != null)
                {
                    var sensorData = JsonConvert.DeserializeObject<Stat>(sensorEntity.Data);
                    // if (sensorData != null && sensorData.IsCompletelyInitialized())
                    // {
                    //     return sensorEntity;
                    // }


                }
                var newEntity = InitializeSensorState(sourceAddress, "");
                return newEntity;

            }
            catch(Exception exc)
            {
                // do not fail the function when the writing to storage fails. Just try to log
                // the exception in Azure Functions 
                return null;
            }

        }

        private StatDataEntity InitializeSensorState(string sourceAddress, string sensorDeviceLocation)
        {
            var emptySensorData = new Stat();

            var newEntity = new StatDataEntity();
            newEntity.PartitionKey = DEFAULT_PARTITIONKEY;
            newEntity.RowKey = sourceAddress;
            newEntity.Data = JsonConvert.SerializeObject(emptySensorData);
            return newEntity;
        }

        public async Task UpdateSensorState(StatDataEntity sensorDataEntity)
        {
            if (sensorDataEntity == null)
            {
                throw new ArgumentNullException(nameof(sensorDataEntity));
            }

            try
            {
                // Create the InsertOrReplace table operation
                TableOperation insertOrMergeOperation = TableOperation.InsertOrMerge(sensorDataEntity);

                // Execute the operation.
                TableResult result = await _table.ExecuteAsync(insertOrMergeOperation);
                StatDataEntity insertedCustomer = result.Result as StatDataEntity;

                if (result.RequestCharge.HasValue)
                {
                    Console.WriteLine("Request Charge of InsertOrMerge Operation: " + result.RequestCharge);
                }
            }
            catch (StorageException e)
            {
                Console.WriteLine(e.Message);
                Console.ReadLine();
                throw;
            }
        }
    }
}