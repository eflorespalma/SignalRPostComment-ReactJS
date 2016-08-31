using Newtonsoft.Json;
using SignalR_Comment.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SignalR_Comment.Controllers
{
    public class InitController : Controller
    {
        readonly string jsonFilePath = "~/Data/data.json";

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetComments()
        {
            string jsonString = string.Empty;
            using (StreamReader r = new StreamReader(Server.MapPath(jsonFilePath)))
                jsonString = r.ReadToEnd();
            List<UserComment> lstItems = JsonConvert.DeserializeObject<List<UserComment>>(jsonString);
            return Json(new { lst = lstItems }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveComment(UserComment model)
        {
            model.fecha = string.Format("{0}.{1}.{2}", DateTime.Now.Day.ToString().PadLeft(2, '0'), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Year.ToString());
            if (string.IsNullOrEmpty(model.displayName))
                model.displayName = "Anónimo";
            AddUserCommentToJsonFile(model);
            return Json(new { success = true });
        }

        private void AddUserCommentToJsonFile(UserComment model)
        {
            string jsonString = string.Empty;
            model.key = Guid.NewGuid().ToString();
            using (StreamReader r = new StreamReader(Server.MapPath(jsonFilePath)))
                jsonString = r.ReadToEnd();
            List<UserComment> lstItems = JsonConvert.DeserializeObject<List<UserComment>>(jsonString);
            lstItems.Add(model);

            jsonString = JsonConvert.SerializeObject(lstItems, Formatting.Indented);
            using (TextWriter writer = new StreamWriter(Server.MapPath(jsonFilePath), false))
                writer.Write(jsonString);
        }
    }
}