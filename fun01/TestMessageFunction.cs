using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Tw.Vos.Fun01
{
    public  class TestMessageFunction
    {
        public TestMessageFunction()
        {
        }

        [Function("TestMessage")]
        [SignalROutput(HubName = "sensordata", ConnectionStringSetting = "AzureSignalRConnectionString")]
        public static MyMessage Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")]HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger("SignalRFunction");
            logger.LogInformation(nameof(TestMessageFunction));

            var stat = new Stat(){
                theText = "Blah blah blah"
            };

            return new MyMessage()
                {
                    Target = "newStat",
                    Arguments = new[] {stat} 
                };
        }

        
        public class MyMessage
        {
            [JsonProperty("target"), JsonRequired]
            public string Target { get; set; }
            [JsonProperty("arguments"), JsonRequired]
            public object[] Arguments { get; set; }
        }
    }

}