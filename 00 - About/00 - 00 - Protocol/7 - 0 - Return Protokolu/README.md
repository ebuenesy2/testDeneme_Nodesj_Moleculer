
# Return Protokolu

## Açıklama
 
 ```
Api Return

 ```
 
 ## Kullanımı
 
 ```
	//! Return Api   
	ctx.params.title = "user.service -> Tüm Veriler"
	ctx.params.table = "user.json"
	ctx.params.status = 1
	ctx.params.size=db.length
	ctx.params.DB = db		
 ```
 
  ```
   //! Return Api	
   ctx.params.title = "note.service -> Veri Güncelleme"
   ctx.params.table = "note.json"        
   ctx.params.status = 0			
   ctx.params.message="Veri Güncellenemedi"	
 ```
 
 
 
 ## Gelen Veri
 
 ```
    "title": "logs.service -> Tüm Veriler",
    "tablo": "logs.json",
    "status": 1,
    "size": 5,
    "DB": []
 ```
 


