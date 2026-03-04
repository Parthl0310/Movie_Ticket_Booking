const timeFormat=(min)=>{
    const hour=Math.floor(min/60);
    const minutes=min%60;
    return `${hour}h ${minutes}m`
}

export default timeFormat;