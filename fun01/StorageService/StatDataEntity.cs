namespace Tw.Vos.Fun01
{
    using System;
    using Microsoft.Azure.Cosmos.Table;

    public class StatDataEntity : TableEntity
    {
        public StatDataEntity()
        {
        }

        public StatDataEntity(string sourceAddress)
        {
            PartitionKey = "SensorData";
            RowKey = sourceAddress;
        }

        public string Data { get; set; }
    }
}