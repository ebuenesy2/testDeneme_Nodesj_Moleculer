'use strict';
const dayjs = require('dayjs'); // ! Zaman
const dotenv = require('dotenv'); // ! env
dotenv.config(); // ! env
const sign = require('jwt-encode'); //! Token - Encode
const jwt_decode = require('jwt-decode'); //! Token - Decode
const fs = require("fs"); //! Dosya
const path = require("path"); //! Dosya
const mkdir = require("mkdirp").sync; //! Dosya-Klasor
const mime = require("mime-types"); //! Dosya-Bilgileri
const sharp = require('sharp');  //! Dosya Yükleme
const fastifyPlugin = require('fastify-plugin'); // ! Fastify-plugin
const fastify = require('fastify')({logger: false}); // ! Fastify
fastify.register(require('fastify-formbody')) // ! Fastify-formbody
this.fastify = fastify; // ! Fastify
const fastifyStatic = require('fastify-static')  // ! Fastify-static
fastify.register(require('fastify-cors'), {})  // ! Fastify-cors

const axios = require('axios'); //! Axios
const querystring = require('querystring'); //! Axios Querystring

/*************   Socket  Tanım *********** */
const fastifySession = require('fastify-session'); // ! Fastify Session
const fastifyCookie = require('fastify-cookie'); // ! Fastify Cookie
fastify.register(fastifyCookie); // ! Fastify Cookie
fastify.register(fastifySession, {secret: 'a secret with minimum length of 32 characters'}); ; // ! Fastify Session
/*************   Socket  Tanım Son *********** */


/*************   Socket  *********** */
fastify.register(require('fastify-websocket'), { options: { maxPayload: 1048576 } })  // ! Fastify Web Socket
let OnlineCount=0; //! Online Sayısı
/*************   Socket Son  *********** */


/*************  File  *********** */
fastify.register(require('fastify-multipart'), {
	addToBody: true,
	limits: {
		fieldNameSize: 100, // Max field name size in bytes
		fieldSize: 53000000, // Max field value size in bytes
		fields: 20,         // Max number of non-file fields
		fileSize: 53000000,      // For multipart forms, the max file size
		files: 10,           // Max number of file fields
		headerPairs: 2000   // Max number of header key=>value pairs 
	}
});
/*************  File Son *********** */

/************* Public File *********** */
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public')
})
/************* Public File Son *********** */



module.exports = {
	name: 'api',

	settings: {
		port: process.env.PORT || 3001
	},

	created() {

		try {


	    // ! ------ Socket -------------------------------
		fastify.route({
			method: 'GET',
			url: '/socket/:userId',
			handler: (req, res) => {      
		
				const zaman=dayjs().toDate(); //! Zaman
				console.log('\u001b[' + 32 + 'm' + '[Socket] [Get] Socket Durum [ /socket/:userId ] :' + '\u001b[0m',req.params);
		
				//! Return
				res.send({ 
					dataType:"Socket",
					dataTypeDescription:"Socket Bilgileri",
					message:"Kullanıcı Bağlandı",
					count:OnlineCount,
					userId:req.session.sessionId,
					time:zaman          
				}) 
				
			},
			wsHandler: (connection, req) => {
				
					OnlineCount++; //! Sayac Artıyor
		
					const sessionId = req.session.sessionId; //! Session ID
					//console.log("Session sessionId: "+sessionId); //! Session ID      
					console.log('\u001b[' + 32 + 'm' + "Bir Kullanıcı Bağlandı SessionId: "+sessionId + '\u001b[0m') 	
				

					//! Herkese Dönüş Yapıyor
					fastify.websocketServer.clients.forEach(function each(client) {
						
						if (client.readyState === 1) {  
		
							//! Return Send
							client.send(JSON.stringify({
								
								fromUserID:Number(req.params.userId),
								fromUserToken:sessionId,
								toAll:true,
								toUserID:0,
								dataType:"Connect",
								dataTypeTitle:"Connected",
								dataTypeDescription:"Bir Kullanıcı Bağlandı",
								dataId: 0,
								data:"Bir Kullanıcı Bağlandı",
								pageTable:null,
								pageToken:null,
								count:OnlineCount,
								date:dayjs().toDate()
		
							}));
							//! Return Send Son
		
						}
					})
					//! Herkese Dönüş Yapıyor Son
					
				//! -- Çıkış Yapıldı ise
				connection.socket.on("close", () => {
					
					OnlineCount--; //! Sayac Azalıyor
					//console.log("Kullanıcı Çıkış Yaptı sessionId: "+sessionId);   //! Kullanıcı Çıkış Yapma   
					console.log('\u001b[' + 31 + 'm' + "Bir Kullanıcı Çıkış Yaptı SessionId: "+sessionId + '\u001b[0m')       
					
					//! -----------  Time Update ----------------------------- 	
					let time_update = this.broker.call('time.loginOut', {
						socketId: Number(req.params.userId),
						socketToken: sessionId
					})		
					//! ----------- End Time Update ----------------------------

		
					//! Return All Clients
					fastify.websocketServer.clients.forEach(function each(client) {
						if (client.readyState === 1) {            
						
							//! Return Send
							client.send(JSON.stringify({
		
								fromUserID:Number(req.params.userId),
								fromUserToken:sessionId,
								fromApiUserToken: Number(req.params.userId),
								toAll:true,
								toUserID:0,
								dataType:"Connect",
								dataTypeTitle:"disConnect",
								dataTypeDescription:"Bir Kullanıcı Çıkış Yaptı",
								dataId: 0,
								data:"Bir Kullanıcı Çıkış Yaptı",
								pageTable:null,
								pageToken:null,
								count:OnlineCount,
								date:dayjs().toDate()
		
							}));
							//! Return Send Son
		
						}
					})
					//! Return All Clients
		
				}) 
				//! -- Çıkış Yapıldı ise Son
		
				
				//! -- Mesaj Alma
				connection.socket.on('message', message => {
		
					const obj = JSON.parse(message); 
					//console.log("Kimden:",sessionId," - Gelen Mesaj Json:",obj);
					//console.log("Gelen FromId:",obj.fromId);
					
					if(obj.dataType=="Time") { console.log("time socket");
											
						//! -----------  Time Add ----------------------------- 	
						let time_add = this.broker.call('time.add', {
							socketId: Number(obj.fromId),
							socketToken: sessionId,     
							pageTable: obj.pageTable,           
							pageToken: obj.pageToken,
							workingMod:	obj.workingMod
						})		
						//! ----------- End Time Add ----------------------------						

					}
					
					
					//! Return All Clients
					fastify.websocketServer.clients.forEach(function each(client) { 
						if (client.readyState === 1) {  
							
								//! Return Send
								client.send(JSON.stringify({
									
									fromUserID: Number(req.params.userId),
									fromUserToken:sessionId,
									fromApiUserToken:obj.fromApiUserToken,
									toAll: obj.toAll,
									toUserID:obj.toAll? true : Number(obj.toUserId),
									dataType: obj.dataType,
									dataTypeTitle: obj.dataTypeTitle,
									dataTypeDescription: obj.dataTypeDescription,
									dataId: obj.dataId,
									data: obj.data,
									incomingToken: obj.incomingToken,
									incomingCount: obj.incomingCount,
									pageTable: obj.pageTable,
									pageToken:obj.pageToken,
									count:OnlineCount,
									date:dayjs().toDate()
			
								}));
								//! Return Send Son
						
						}
					})
					//! End Return All Clients
								
		
				}) 
				//! -- Mesaj Alma Son   
		
				
			}
		
		})
		// ! ------ Socket Son -------------------------------
			

		// ! ------ Get -------------------------------

		//! Home
		fastify.get('/', function (req, res) {			

			res.send({

				title: 'Yıldırım Dev -  Anasayfa  Get - api - fastify - moleculer - json - [ Port ] [ 3001 ]',
				publishCount:16,
				zaman: dayjs().toDate()
			});

			console.log('\u001b[' + 32 + 'm' + 'Get Yapıldı - Anasayfa [ api-service.js ] - [ /env ] ' + '\u001b[0m');	

		}) //! End Home

		// ! ------ Env -----------------------------
		
		//! Env
		fastify.get('/env', function (req, res) {
			res.send({
				title: 'Env Bilgileri',
				PORT: process.env.PORT,
				API:
				{
					APi_URL: process.env.APi_URL,
					APi_URL_Dev: process.env.APi_URL_Dev,
					APi_URL_Local: process.env.APi_URL_Local,
					APi_Title: process.env.APi_Title,
					APi_Name: process.env.APi_Name
				},	
				Version:
				{
					Version: process.env.Version,
					Release_Date: process.env.Release_Date,
					Version_Title: process.env.Version_Title,
					Author: process.env.Author
				}				
			
			});

			console.log('\u001b[' + 32 + 'm' + 'Env Bilgileri [ /env ] ' + '\u001b[0m');	
		}) //! End Env

		// ! ------ Env  Son ------------------------

		// ! ------ Version -------------------------

		//! Version
		fastify.get('/version', function (req, res) {
			res.send({
				title: 'Verison Bilgileri',
				Version: process.env.Version,
				Release_Date: process.env.Release_Date,
				Version_Title: process.env.Version_Title,
				Author: process.env.Author
			});

			console.log('\u001b[' + 32 + 'm' + 'Verison Bilgileri [ /version ] ' + '\u001b[0m');	

		}) //! Version Son
		// ! ------ Version Son  --------------------

	    // ! ------ Bilgiler -------------------------

		//! Bilgiler
		fastify.get('/info', function (req, res) {
			res.send({
				title: 'Proje Bilgileri',
				PORT: process.env.PORT,
				API:
				{
					APi_URL: process.env.APi_URL,
					APi_URL_Dev: process.env.APi_URL_Dev,
					APi_URL_Local: process.env.APi_URL_Local,
					APi_Title: process.env.APi_Title,
					APi_Name: process.env.APi_Name
				},	
				Version:
				{
					Version: process.env.Version,
					Release_Date: process.env.Release_Date,
					Version_Title: process.env.Version_Title,
					Author: process.env.Author
				}				
			
			});

			console.log('\u001b[' + 32 + 'm' + 'Proje Bilgileri [ /info ] ' + '\u001b[0m');	
	
		}) //! End Bilgiler

		// ! ------ Bilgiler Son  --------------------
		



		// ! ------ Post -----------------------------

			// http://localhost:3000/
			fastify.post('/', function (req, res) {

				//res.send(req.body.name);
				res.send(req.body);
				console.log(req.body);

			}) //post	

	//************************************* Token  **************************************************** */	

		// ! ------  Token -------------------------------

			// ! Get Token
			fastify.post('/token', function (req, res) {

				const secret = 'secret';
				const data = req.body;
				const jwt = sign(data, secret);
				res.send({
					Token: jwt
				});

			}) // ! Get Token	



		//! -------------------------   Token Çözme	-----------------------------

			fastify.post('/token_post', function (req, res) {

				var token = req.body.token;
				var decoded = jwt_decode(token);

				res.send(decoded)

			}) //! Token

		//! -------------------------   Token Çözme	Son	-----------------------------
		
			
		//************************************* Api  **************************************************** */			

		//! -------------------------   Api Get -----------------------------

			fastify.get('/api_get', async function (req, res) {

				var api_url = "https://jsonplaceholder.typicode.com/posts";

			   const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts')
								.catch((err) => {
									console.error(err)
									return {data: null};
								})
			   if (!data) return res.json({status:'error'})
							
               
				res.send({
					title: 'Api Bilgileri',
					api_url: api_url,
					apiData:data
					
				});

			   console.log('\u001b[' + 32 + 'm' + 'Api Bilgileri [ /api_get ] ' + '\u001b[0m');	

			}) //! Api

		//! -------------------------   Api Get	Son	-----------------------------
			
			
		//! -------------------------   Api Post -----------------------------

			fastify.post('/api_post', async function (req, res) {

				var api_url = "https://jsonplaceholder.typicode.com/posts";

				const postData = {
					"title": "title post",
					"mesaj":req.body.mesaj
				}

				const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', querystring.stringify(postData))
							.catch((err) => {
								console.error(err)
								return {data: null};
							})
				if (!data) return res.json({status:'error'})
							
               
				res.send({
					title: 'Api Bilgileri',
					api_url: api_url,
					apiData:data					
				});

			   console.log('\u001b[' + 32 + 'm' + 'Api Bilgileri [ /api_post ] ' + '\u001b[0m');	

			}) //! Api

		//! -------------------------   Api Post Son	-----------------------------

		//************************************* Web  **************************************************** */
			
								
	    //************************************* Mail  **************************************************** */				
		
		//! -------------------------   Mail Post -----------------------------

			// ! Send Mail
			fastify.post('/send_mail', function (req, res) {

				res.send({
					title: 'Mail Gönderme',
					postData: req.body
				});

				console.log('\u001b[' + 32 + 'm' + 'Mail Gönderme [ /send_mail ] ' + '\u001b[0m');
			}) // ! Send Mail

		//! -------------------------   Mail Post Son -----------------------------

		//! -------------------------   Mail Get -----------------------------

			fastify.get('/mail_get', async function (req, res) {

				var status = "error";
				
               
				res.send({
					title: 'Mail Bilgileri',
					mesaj: "Mail",
					status: status
				});

			   console.log('\u001b[' + 32 + 'm' + 'Mail Gönderme [ /mail_get ] ' + '\u001b[0m');	

			}) //! Mail

		//! -------------------------   Mail Get	Son	----------------------------------------------------------		



		//!-------------  User --------------------------------------------------------------------------------------------------

    		fastify.get('/api/user/info',async (req,res)=> this.broker.call("user.info")) //! İnfo
			fastify.post('/api/user/post', async (req, res) => this.broker.call("user.post",{...req.body})) //! POST
			fastify.get('/api/user/html',async (req,res)=> this.broker.call("user.html")) //! Html
			fastify.get('/api/user/all', async (req, res) => this.broker.call("user.all")) //! All		

		

		//!---------------- User son ----------------------------------------------------------------------------------------------




		//************************************* Server  **************************************************** */
		// ! Server dinliyor
		const start = async () => {
			try {
				  await fastify.listen(process.env.PORT || 3001, '0.0.0.0')
				  console.log('\u001b[' + 32 + 'm' + 'Port Listening [ '+process.env.PORT+' ]' + '\u001b[0m');	
				  
			} catch (err) {
				fastify.log.error(err)
				process.exit(1)
			}				
		}

		// ! Başlatıyor
			start()

		} catch (err) {
			console.log(err);
		}
	}
};
