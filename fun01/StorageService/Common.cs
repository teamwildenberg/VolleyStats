using System;
using Microsoft.Azure.Cosmos.Table;

namespace Tw.Vos.Fun01
{
    public class Common
   {
       public static CloudStorageAccount CreateStorageAccountFromConnectionString(string storageConnectionString)
       {
           CloudStorageAccount storageAccount;
           try
           {
               storageAccount = CloudStorageAccount.Parse(storageConnectionString);
           }
           catch (FormatException)
           {
               Console.WriteLine("Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the application.");
               throw;
           }
           catch (ArgumentException)
           {
               Console.WriteLine("Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the sample.");
               throw;
           }

           return storageAccount;
       }
   }
}