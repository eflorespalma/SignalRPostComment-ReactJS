var Comment = React.createClass({
    getLikes: function (e) {
        alert("La cantidad de Likes es : " + this.props.likes);
    },
    render: function () {
        return (
            <div className='social-comment'>
                <a href='#' className='pull-left'>
                    <img src={imgPath + this.props.avatar} />
                </a>
                <div className='media-body'>
                     <a href="#">{this.props.displayName}</a>&nbsp;
                    {this.props.comment}
                     <br />
                     <a href="#" onClick={this.getLikes} className="small">
                        <i className='fa fa-thumbs-up'></i>{this.props.likes == 0 ? "" : this.props.likes} Like this!
                     </a> - <small className='text-muted'>{this.props.fecha}</small>
                </div>
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function () {
        var style = {
            float: 'right'
        };
        return (
        <div className='social-comment'>
            <a href='#' className='pull-left'>
                <img src={imgPath + this.props.imgUser} />
            </a>
            <div className="media-body">
                <textarea id="message" ref="message" className="form-control" placeholder="Escribe un comentario..."></textarea>
                <hr />
                <a className="btn btn-success btn-rounded" href="#" style={style} onClick={this.props.fnComment}>Enviar</a>
            </div>
        </div>
        );
    }
});

var CommentList = React.createClass({
    getMessage: function () {
        return this.refs.Child.refs.message.value;
    },
    cleanMessage: function () {
        this.refs.Child.refs.message.value = '';
    },
    render: function () {
        var commentsList = this.props.data.map(function (item) {
            return (
            <Comment avatar={item.avatar}
                     displayName={item.displayName}
                     comment={item.comment }
                     likes={item.likes}
                     fecha={item.fecha}
                     key={item.key} />
            );
        });
        return (
                <div className="social-footer">
                    {commentsList}
                    <CommentForm ref="Child" imgUser={this.props.imgUser} fnComment={this.props.fnComment} />
                </div>
            );
    }
});

var ProfileComment = React.createClass({
    render: function () {
        return (
            <div>
                <div className='social-avatar'>
                    <a href='#' className='pull-left'><img alt='image' src={this.props.imgProfile} /></a>
                    <div className="media-body">
                    <a href="#">Edgar Flores</a>
                    <small className="text-muted">Hoy 4:21 pm - 29.08.2016</small>
                    </div>
                </div>
                <div className="social-body">
                    <p>
                        Los datos de Sensor Tower, SurveyMonkey y Apptopia también apuntan que el interés, las descargas,
                        los usuarios activos y el tiempo gastado en Pokémon Go ha decaído cada día. Esto al igual que la búsqueda
                        en Google de "realidad aumentada", la cual había aumentado al momento de lanzarse el juego móvil.
                        Si las bajas en los usuarios continúan esto podría traducirse en problemas no solo para Pokémon Go,
                        si no que para la realidad aumentada en general.
                    </p>
                    <div className="btn-group">
                        <button className="btn btn-white btn-xs"><i className="fa fa-thumbs-up"></i> Like this!</button>
                    </div>
                </div>
            </div>
            );
    }
});

var NewsBox = React.createClass({
    setRandomAvatar: function () {
        var avatar = Math.floor(Math.random() * profilesIMG.length);
        document.getElementById('imgName').value = profilesIMG[avatar];
    },
    getMessage: function () {
        return this.refs.Child.getMessage();
    },
    cleanMessage: function () {
        this.refs.Child.cleanMessage();
    },
    saveComment: function (model) {
        $.ajax({
            type: 'POST',
            url: '/Init/SaveComment',
            data: JSON.stringify(model),
            contentType: 'application/json',
            cache: false,
            async: true,
            dataType: 'json'
        });
    },
    loadUsersComments: function () {
        var lstComment = [];
        $.ajax({
            type: 'GET',
            url: '/Init/GetComments',
            contentType: 'application/json',
            cache: false,
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data.lst)
                    lstComment = data.lst;
            }
        });
        return lstComment;
    },
    getInitialState: function () {
        this.setRandomAvatar();
        var lstComment = this.loadUsersComments();
        return {
            data: lstComment
        };
    },
    CommentPost: function () {
        var commentHub = $.connection.commentHub;
        var userModel = {
            avatar: document.getElementById('imgName').value,
            displayName: document.getElementById('displayname').value,
            comment: this.getMessage(),
            likes: 0
        }
        commentHub.server.commentStatus(userModel.displayName, userModel.avatar, this.getMessage());
        this.saveComment(userModel);
        this.cleanMessage();
    },
    componentDidMount: function () {
        var fecha = Pad(d.getDate()) + "." + Pad(d.getMonth() + 1) + "." + d.getFullYear().toString();
        var commentHub = $.connection.commentHub;
        var _this = this;
        commentHub.client.commentPost = function (name, img, message) {
            var key = GetKey();
            var nextItems = _this.state.data.concat([{ key: key, avatar: img, displayName: name, comment: message, likes: 0, fecha: fecha }]);
            _this.setState({ data: nextItems });
        };
    },
    render: function () {
        return (
            <div>
                <ProfileComment imgProfile={imgProfile} />
                <CommentList ref="Child" data={this.state.data} imgUser={document.getElementById('imgName').value} fnComment={this.CommentPost} />
            </div>
            );
    }
});
/*
TODO => Make the transitions with React on Load Comments and Post Comment
https://facebook.github.io/react/docs/animation.html
*/
ReactDOM.render(<NewsBox />, document.getElementById('content'));