const isotimeformate=(datetime)=>{
    const date=new Date(datetime)
    const localtime=date.toLocaleTimeString('en-US',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:'true',
    })
    return localtime
}

export default isotimeformate;