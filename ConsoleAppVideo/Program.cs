using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio.Auth;
using Twilio.Jwt.AccessToken;

namespace ConsoleAppVideo
{
    class Program
    {
        static void Main(string[] args)
        {
            // Substitute your Twilio AccountSid and ApiKey details
            var AccountSid = "AC144531a2b10239558e9510a280c3f792";
            var ApiKeySid = "SKd073d9057aa986c4405227f7d95c8c38";
            var ApiKeySecret = "8eQNRpgmysrGs0Y7E9Mw9DlBahPxWq3x";
            var videoConfigSid = "SKd073d9057aa986c4405227f7d95c8c38";
            var identity = "Jose Antonio Sarria Garcia";

            var token = new AccessToken(AccountSid, ApiKeySid, ApiKeySecret);
            token.Identity = identity;

            // Crear un generador de token de acceso
            var grant = new Twilio.Auth.ConversationsGrant();
            grant.ConfigurationProfileSid = videoConfigSid;
            token.AddGrant(grant);

            Console.WriteLine(token.ToJWT().ToString());

        }
    }
}
