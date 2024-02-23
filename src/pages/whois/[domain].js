import { Box, Flex, Text, Alert, AlertIcon } from "@chakra-ui/react";

export default function Whois({ domainInfo, error }) {
    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Flex direction="column" align="center" p={5}>
            <Text fontSize="xl" mb={2}>你应该需要买这些东西</Text>
            {domainInfo && (
                <Box p={4} borderWidth="1px" borderRadius="lg">
                    <Text><b>推荐的商品:</b> {domainInfo.result}</Text>
                </Box>
            )}
        </Flex>
    );
}

export async function getServerSideProps(context) {
    const domain = context.query.domain;
    let domainInfo = null;
    let error = null;

    if (domain) {
        try {
            const res = await fetch(`https://whois-nextjs-five.vercel.app/api/whois?domain=${domain}`);
            domainInfo = await res.json();
            console.log("result:"+domainInfo.result);
        } catch (err) {
            console.error("Error fetching domain info:", err);
            error = "无法获取域名信息，请稍后重试。";
        }
    }

    return {
        props: { domainInfo, error }, // 将会被传递给页面组件作为props
    };
}
