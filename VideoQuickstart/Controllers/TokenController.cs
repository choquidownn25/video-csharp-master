using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Twilio;
using Twilio.Auth;
using JWT;
using Faker;

namespace VideoQuickstart.Controllers
{
    public class TokenController : Controller
    {
        // GET: /token
        public ActionResult Index(string Device)
        {
            //Cargar la configuración de Twilio desde Web.config
            var accountSid = ConfigurationManager.AppSettings["TwilioAccountSid"];
            var apiKey = ConfigurationManager.AppSettings["TwilioApiKey"];
            var apiSecret = ConfigurationManager.AppSettings["TwilioApiSecret"];
            var videoConfigSid = ConfigurationManager.AppSettings["TwilioConfigurationSid"];

            // Crear una identidad aleatoria para el cliente.
            var identity = "Jose Antonio Sarria Garcia";

            var token = new AccessToken(accountSid, apiKey, apiSecret);
            token.Identity = identity;
           
            // Crear un generador de token de acceso
            var grant = new ConversationsGrant();
            grant.ConfigurationProfileSid = videoConfigSid;
            token.AddGrant(grant);

            return Json(new
            {
                identity = identity,
                accountSid = accountSid,
                apiKey = apiKey,
                apiSecret = apiSecret,
                token = token.ToJWT()
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
