import { Helmet } from "react-helmet";


//basically in whichever component this particular component is renderred 
//or should i say in whichever page the component is rendered 
//that page's title will be whatever title is inside the title
//variable
function MetaData({title})
{

    return (
        <>
        <Helmet>
            <title>{title}</title>
        </Helmet>
        </>
    )
}

export default MetaData