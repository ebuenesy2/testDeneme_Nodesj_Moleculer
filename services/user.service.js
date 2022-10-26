'use strict';
const dayjs = require('dayjs'); //! Zaman
const fs = require("fs"); //! Dosya
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/user.json'); //! Json

const nodemailer = require('nodemailer'); //! Mail

/************* Mail *********** */
let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.com.tr',
    port: 465,
    auth: {
        user: "ebuenesdeneme@gmail.com",
        pass: "2622147enesDeneme"
    }
})

transporter.verify(function (error, success) {

  if (error) { console.log("Baglantı Hatası:",error); }
  else { console.log('Bağlantı başarıyla sağlandı'); }

});
/************* Mail Son *********** */



module.exports = {
	name: "user",

	actions: {
		
		async forgotPassword(ctx) {
			let user = db.find(u => u.email == ctx.params.email);

			console.log("userForget burda");
			
	        try {
				
				if (user) {
						let newPassword = "deneme123";			
						let mailOptions = {
							from: 'ebuenesy2@gmail.com',
							to: ctx.params.email,
							subject: 'Şifre Yenileme',
							text: 'Merhaba ' + 'İyi Günler Dileriz.',
						};

						transporter.sendMail(mailOptions, async (error) => {
							if (error) {
								throw ({ code: 404, message: "Şifre sıfırlanırken bir hata oluştu." })
							} else {
										//   mail gönderim sonrasında işlem varsa burda yap
							}
						});

						ctx.params.status = "success"
						ctx.params.user = user

						return ctx.params
						
				}
				else
					throw ({ code: 404, message: "Kullanıcı Bulunamadı" })

			} catch (error) {
				
				ctx.params.status = "error"
				ctx.params.error = error
				
				return ctx.params

			}
		}
	}
}


