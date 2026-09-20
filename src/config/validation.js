

const validateProfileEditData=(req)=>
{
    const allowedFields=[
        "firstName",
        "lastName",
        "gender",
        "about",
        "skills"
    ]
    const isEditAllowed= Object.keys(req.body).every((k)=>allowedFields.includes(k))
    return isEditAllowed;
}

module.exports={validateProfileEditData}