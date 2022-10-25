									
		//!------------- supportRequestComment  --------------------------------------------------------------------------------------------------

			fastify.get('/api/supportRequestComment/info',async (req,res)=> this.broker.call("supportRequestComment.info")) //! İnfo
			fastify.post('/api/supportRequestComment/post', async (req, res) => this.broker.call("supportRequestComment.post",{...req.body})) //! POST
			fastify.get('/api/supportRequestComment/html',async (req,res)=> this.broker.call("supportRequestComment.html")) //! Html
			fastify.get('/api/supportRequestComment/all', async (req, res) => this.broker.call("supportRequestComment.all")) //! All

			fastify.get('/api/supportRequestComment/:id', async (req, res) => this.broker.call("supportRequestComment.find",{id: req.params.id})) //! Search	
			fastify.post('/api/supportRequestComment/find_post', async (req, res) => this.broker.call("supportRequestComment.find_post",{...req.body})) //!  Search-Post
			fastify.post('/api/supportRequestComment/find_token', async (req, res) => this.broker.call("supportRequestComment.find_token",{...req.body})) //!  Search-Token	
			fastify.post('/api/supportRequestComment/find_user', async (req, res) => this.broker.call("supportRequestComment.find_user", { ...req.body })) //!  Search-UserToken
			fastify.post('/api/supportRequestComment/find_table', async (req, res) => this.broker.call("supportRequestComment.find_table", { ...req.body })) //!  Search-Table

			fastify.post('/api/supportRequestComment/find_serverToken', async (req, res) => this.broker.call("supportRequestComment.find_serverToken",{...req.body})) //! Search - FromServerToken	
			fastify.post('/api/supportRequestComment/find_serverId', async (req, res) => this.broker.call("supportRequestComment.find_serverId",{...req.body})) //! Search - FromServerId
			
			fastify.post('/api/supportRequestComment/add', async (req, res) => this.broker.call("supportRequestComment.add",{...req.body})) //! CREATE		
			fastify.post('/api/supportRequestComment/update', async (req, res) => this.broker.call("supportRequestComment.update",{...req.body})) //! UPDATE
			fastify.post('/api/supportRequestComment/updated_delete/:id', async (req, res) => this.broker.call("supportRequestComment.updated_delete",{id:req.params.id,...req.body})) //! UPDATE DELETE
			fastify.post('/api/supportRequestComment/delete/:id', async (req, res) => this.broker.call("supportRequestComment.delete", { id: req.params.id, ...req.body })) //! DELETE
			fastify.post('/api/supportRequestComment/delete_update/:id', async (req, res) => this.broker.call("supportRequestComment.delete_update",{id: req.params.id,...req.body})) //! DELETED Update
				
	    //!---------------- supportRequestComment son ----------------------------------------------------------------------------------------------