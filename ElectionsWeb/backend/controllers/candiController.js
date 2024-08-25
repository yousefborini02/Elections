const knex = require('../config/db');

exports.createCandidate  = async (req, res) => {
    
  
    try {
        const { N_Id,candidate_name,  circle_id, local_list_id } = req.body;
       
        // تحقق إذا كان المرشح موجود بالفعل في الجدول
        const existingCandidate = await knex('LocalListsCandidates').where({ N_Id }).first();
        console.log("1")
        if (existingCandidate) {
            console.log("2")
            return res.status(400).json({ error: "المرشح موجود بالفعل في هذه القائمة المحلية" });
           
        } console.log("3")

        // إدخال المرشح الجديد وربطه بالقائمة المحلية
        const [id] = await knex('LocalListsCandidates').insert({ 
            N_Id,
            candidate_name,
            circle_id,
            local_list_id
        }).returning('id');
        console.log("4")
        // res.status(201).json({
        //     message: "تمت إضافة المرشح وربطه بالقائمة المحلية بنجاح!",
        //     candidateId: id
        // });
        res.json("Ss")
     
    } catch (error) {
        console.error("حدث خطأ أثناء إضافة المرشح:", error);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المرشح" });
    }
};
