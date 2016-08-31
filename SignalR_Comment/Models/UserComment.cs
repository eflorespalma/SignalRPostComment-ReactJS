using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SignalR_Comment.Models
{
    public class UserComment
    {
        public string key { get; set; }
        public string avatar { get; set; }
        public string displayName { get; set; }
        public string comment { get; set; }
        public int likes { get; set; }
        public string fecha { get; set; }
    }
}