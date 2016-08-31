using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalR_Comment
{
    public class CommentHub : Hub
    {
        public void CommentStatus(string name, string img, string message)
        {
            Clients.All.commentPost(name, img, message);
        }
    }
}