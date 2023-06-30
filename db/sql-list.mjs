
//kigenerálja az objektumból a VALUES és PLACEHOLDERS listát
//INSERT és UPDATE számára

//így nem kell azokat kézzel megírni
//az objektumban csak azok a mezők kell legyenek 
//amelyeket haszn'l az insert vagy update

export default function generateValueList(o) {
    let valueList = ""; //mezo1, mezo2, ..
    let placeHolders = ""; //:mezo1, :mezo2, ...
    let setList = ""; // mezo1 = :mezo1, mezo2 = :mezo2
  
    for (let k of Object.keys(o)) {
      valueList += `${k}, `;
      placeHolders += `:${k}, `;
      if (k!='id') {
        setList += `${k} = :${k}, `;
      }
    }
    valueList = valueList.slice(0, -2);
    placeHolders = placeHolders.slice(0, -2);
    setList = setList.slice(0, -2);
  
    return [valueList, placeHolders, setList];
  }