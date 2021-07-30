using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;

namespace Tw.Vos.Fun01
{
    public  class SignalrNegotiate
    {
        public SignalrNegotiate()
        {
        }

        [Function(nameof(SignalrNegotiate))]
        public static MyConnectionInfo Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")]HttpRequestData req,
            [SignalRConnectionInfoInput(HubName = "statHub")] MyConnectionInfo connectionInfo,
            FunctionContext context)
        {
            var logger = context.GetLogger(nameof(SignalrNegotiate));
            logger.LogInformation($"Connection URL = {connectionInfo.Url}");

            return connectionInfo;
        }
    }

    public class MyConnectionInfo
    {
        public string Url { get; set; }

        public string AccessToken { get; set; }

        public string LastKnownSensorData {get;set;}
    }

}