import React, { useState } from 'react';
import { Carousel, Card, Rate, Row, Col, List, Button, Modal, Icon } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import image1Url from '@/assets/image/dongzao1.jpg';
import image2Url from '@/assets/image/dongzao2.jpg';
import image3Url from '@/assets/image/dongzao3.jpg';
import styles from './style.less';



const HomePage: React.FC<{}> = () => {
    const [visible, changeVisible] = useState<boolean>(false);
    const data = [{
        title: '企业名称',
        desc: '山西省临猗县'
    }, {
        title: '所属行业',
        desc: '农业'
    }, {
        title: '企业性质',
        desc: '有限责任公司'
    }, {
        title: '企业法人',
        desc: '史先生'
    }, {
        title: '联系方式',
        desc: '19935999999'
    }, {
        title: '通信地址',
        desc: '山西省 运城市 山西省临猗县万亩设施冬枣示范基地'
    }, {
        title: '种植面积',
        desc: '2000'
    }, {
        title: 'hash编码',
        desc: '15912ba213adrew43324fsd2c3r3t3qct1y4558fhd1b389agcn2349ads22473rnv'
    }];

    const productData = [{
        title: '产品名称',
        desc: '临猗冬枣'
    }, {
        title: 'hash编码',
        desc: '15912ba213adrew43324fsd2c3r3t3qct1y4558fhd1b389agcn2349ads22473rnv'
    }]

    const descData = [{
        title: '哈希编码',
        desc: '15912ba213adrew43324fsd2c3r3t3qct1y4558fhd1b389agcn2349ads22473rnv'
    }];

    const footerDesc = "临猗县地处山西省南部运城盆地，属暖温带大陆性气候，光热条件优越，四季分明，春秋少雨，夏季雨量集中，年降水量在512mm，年平均气温13.5℃，而冬枣正常生长年均温度要在11℃以上，适宜临猗冬枣生长。临猗冬枣从萌芽到果实成熟，温度在14-35℃。4-5月份是冬枣花蕾分化期，临猗气温在14-16℃，有利花蕾分化；5-7月临猗降雨比较集中，气温在22-26℃，正是临猗冬枣的坐果期和膨大期，充沛的降雨保证了枣果生长所需的水分，使枣果多汁，适宜的高温促进果实坐果和膨大；8月份降雨有所减少，气温在22-35度，光照充足，枣叶光合作用加强，有利于有机物积累，促进枣果着色，果面先后呈现出点状、片状赭红、颜色鲜艳，同时降雨的减少也降低了生理裂果；9月份枣果成熟期，昼夜温差大，温度在14-27℃，有利于糖分积累，枣果浓甜。土壤方面，临猗土层深厚，属于草甸土类褐潮土，有机质含量高，土壤PH值在7.5—8.5之间，这种碱性土壤最适宜临猗冬枣生长，产出的冬枣果实个大，皮薄肉脆，核小肉厚，质地细腻；富含天门冬氨酸、丝氨酸等等19种人体所需的氨基酸。适宜的土壤、光照等优越的自然条件造就了临猗冬枣独特的品质和风味。"

    return (
        <GridContent>
            <React.Fragment>
                <Row gutter={24} className={styles.row}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className={styles.borderSty}>
                        <Card
                            className={styles.crouselCard}
                            cover={
                                <Carousel className={styles.carousel}>
                                    <div>
                                        <img src={image1Url} height={400} width="100%" />
                                    </div>
                                    <div>
                                        <img src={image2Url} height={400} width="100%" />
                                    </div>
                                    <div>
                                        <img src={image3Url} height={400} width="100%" />
                                    </div>
                                </Carousel>}
                        >
                            <div className={styles.desc}>
                                <h2>¥ 288<span className={styles.tPrice}>新鲜品尝价</span></h2>
                                <div className={styles.lydzDes}>临沂冬枣 （大棚 5斤每箱）</div>
                                <div className={styles.gjrz}>国家认证：<Rate count={5} defaultValue={5} disabled /></div>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className={styles.borderSty}>
                        <Card>
                            <List
                                size="small"
                                header={<p className={styles.cpjs}><h3><Icon type="crown" theme="twoTone" twoToneColor="#FADB14" /> 产品介绍</h3><Button onClick={() => changeVisible(true)} size="small">详情信息</Button></p>}
                                bordered={false}
                                footer={
                                    <>
                                        <p> 产品图片：</p>
                                        <img height={200} width={"100%"} src="http://1.71.135.106:8888/0018DE743E31/2020-07-30/1cefd2e8cca1488d3a7d1e894c0c09572186dc9dfcf54dc1ed65919d7925a812.jpg" />
                                        <p style={{ marginTop: 10 }}>
                                            临猗冬枣现已成为临猗发展特色经济的主导产业，从事临猗冬枣产业的群众达30万人，全县临猗冬枣面积达20万亩，产量6亿余斤，产值20亿元。临猗冬枣畅销北京、上海、广州等全国38座大中城市，在全国冬枣市场占有率达25%。同时销往智利、澳大利亚、俄罗斯、迪拜等国家和地区。
                                            临猗县已经成为全国一流优质鲜食枣生产基地，被授予“全国经济林建设先进县”、“全国枣业十强县”、“全国设施冬枣科技创新基地”等荣誉。在2019年中国北京世界园艺博览会上，“临猗二代冬枣”荣获“国际竞赛铜奖。
                                    </p>
                                    </>}
                                dataSource={productData}
                                renderItem={item => <List.Item><span>{item.title}：{item.desc}</span></List.Item>}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} className={styles.row}>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className={styles.borderDesc}>
                        <Card>
                            <List
                                size="small"
                                header={<h3><Icon type="bank" theme="twoTone" /> 企业信息</h3>}
                                bordered={false}
                                dataSource={data}
                                renderItem={item => <List.Item><span>{item.title}：{item.desc}</span></List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24} className={styles.borderDesc}>
                        <Card>
                            <List
                                size="small"
                                header={<h3><Icon type="api" theme="twoTone" twoToneColor="#52c41a" /> 企业介绍</h3>}
                                bordered={false}
                                dataSource={descData}
                                footer={footerDesc}
                                renderItem={item => <List.Item><span>{item.title}：{item.desc}</span></List.Item>}
                            />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="临猗冬枣信息"
                    visible={visible}
                    onCancel={() => changeVisible(false)}
                    footer={
                        <Button type="primary" onClick={() => changeVisible(false)}>确认</Button>
                    }
                >
                    <p>
                        临猗冬枣成熟期早，6月下旬日光温室枣棚开始成熟；成熟期长，6月下旬至10月上旬均有成熟；货架期长，6月下旬至12月均有上市。
                        临猗冬枣状如小苹果，果形周正、近圆形，果肩平圆，平均单果重20—25克左右，较大枣果重45克左右;果面光亮，颜色鲜艳，果面呈现点状、片状赭红色；果肉厚，白色，质地细腻，皮薄肉脆核小，浓甜多汁，含糖量≧18.9%，可食率达96.9%，富含天门冬氨酸、苏氨酸、丝氨酸等19种人体所需的氨基酸，总含量≧0.985毫克/100克。
                        临猗冬枣具有优良品质，自上市以来，受到消费者的青睐，产品供不应求，经济效益十分可观。
                    </p>
                </Modal>
            </React.Fragment>
        </GridContent>
    )
}

export default HomePage