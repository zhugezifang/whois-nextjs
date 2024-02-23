import NodeCache from "node-cache";
const myCache = new NodeCache({ stdTTL: 86400 }); // 缓存24小时

export const maxDuration = 300;

export default async function handler(req, res) {
    const { domain } = req.query;
    if (!domain) {
        return res.status(400).json({ error: "缺少必要的参数：domain" });
    }

    // 尝试从缓存中获取数据
    const cachedData = myCache.get(domain);
    if (cachedData) {
        return res.status(200).json(cachedData);
    }

    // 缓存中没有数据，继续查询外部API
    //const [name, suffix] = domain.split(".");
    //const apiUrl = `https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`;
    const prompt="根据下面的描述内容，推荐关联性比较强的2个电商的商品："+domain;
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
        const response = await fetch('https://aip.baidubce.com/oauth/2.0/token?client_id=2NKUxy61vnt6VuO1G05jYHsi&client_secret=Uga7yw0jH04srKZOFhwxXgrZKQrQ7Too&grant_type=client_credentials', options);
        //const response = await fetch(apiUrl);
        const data = await response.json();
        const token=data.access_token;
        console.log("token:"+token);
        const chatUrl="https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token="+token;
        var options = {
            'method': 'POST',
            'headers': {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    "messages": [
                            {
                                    "role": "user",
                                    "content": prompt
                            }
                    ],
                    "disable_search": false,
                    "enable_citation": false
            })
    
        };


        const response2 = await fetch(chatUrl, options);
        //const response = await fetch(apiUrl);
        const data2 = await response2.json();
        console.log("result:"+data2.result);
        
        // 将数据存储到缓存中
        myCache.set(domain, data2);

        res.status(200).json(data2);
    } catch (error) {
        res.status(500).json({ error: "服务器错误，无法获取域名信息" });
    }
}
