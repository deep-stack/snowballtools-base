import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  snowZIndex?: number;
}>;

export const CloudyFlow = ({ className, children, snowZIndex }: Props) => {
  return (
    <div className={`bg-sky-100 relative ${className || ''}`}>
      {children}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: snowZIndex || 0 }}
      >
        <div className="w-[3.72px] h-[3.72px] left-[587px] top-[147px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.72px] h-[4.72px] left-[742px] top-[336px] absolute bg-white rounded-full" />
        <div className="w-[3.49px] h-[3.49px] left-[36px] top-[68px] absolute bg-white rounded-full" />
        <div className="w-[3.25px] h-[3.25px] left-[55px] top-[114px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.60px] h-[5.60px] left-[1334px] top-[63px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.53px] h-[3.53px] left-[988px] top-[108px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.65px] h-[2.65px] left-[1380px] top-[16px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.60px] h-[3.60px] left-[1284px] top-[95px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-0.5 h-0.5 left-[1191px] top-[376px] absolute bg-white rounded-full" />
        <div className="w-[2.83px] h-[2.83px] left-[1182px] top-[257px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.41px] h-[2.41px] left-[627px] top-[26px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.71px] h-[5.71px] left-[30px] top-[33px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.09px] h-[4.09px] left-[425px] top-[386px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.38px] h-[3.38px] left-[394px] top-[29px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.70px] h-[4.70px] left-[817px] top-[113px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-1.5 h-1.5 left-[1194px] top-[332px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.89px] h-[4.89px] left-[811px] top-[76px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.25px] h-[4.25px] left-[458px] top-[366px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.82px] h-[4.82px] left-[936px] top-[46px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.74px] h-[3.74px] left-[64px] top-[132px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-1 h-1 left-[763px] top-[10px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.67px] h-[3.67px] left-[861px] top-[106px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.62px] h-[3.62px] left-[710px] top-[278px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.45px] h-[3.45px] left-[1069px] top-[329px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.92px] h-[2.92px] left-[1286px] top-[299px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.84px] h-[4.84px] left-[219px] top-[269px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.39px] h-[2.39px] left-[817px] top-[121px] absolute bg-white rounded-full" />
        <div className="w-[5.83px] h-[5.83px] left-[168px] top-[320px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.94px] h-[5.94px] left-[419px] top-[244px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.67px] h-[4.67px] left-[604px] top-[309px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.87px] h-[5.87px] left-[1098px] top-[379px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.85px] h-[5.85px] left-[644px] top-[352px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.19px] h-[4.19px] left-[1361px] top-[349px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.84px] h-[2.84px] left-[1299px] top-[194px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.51px] h-[4.51px] left-[468px] top-[319px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.73px] h-[2.73px] left-[1084px] top-[86px] absolute bg-white rounded-full" />
        <div className="w-[3.43px] h-[3.43px] left-[1271px] top-[28px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.25px] h-[2.25px] left-[106px] top-[197px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.82px] h-[2.82px] left-[122px] top-[173px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.89px] h-[2.89px] left-[343px] top-[345px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.82px] h-[2.82px] left-[433px] top-[40px] absolute bg-white rounded-full" />
        <div className="w-[4.11px] h-[4.11px] left-[904px] top-[350px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.42px] h-[4.42px] left-[1066px] top-[349px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.67px] h-[4.67px] left-[904px] top-[317px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.54px] h-[5.54px] left-[501px] top-[336px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.11px] h-[4.11px] left-[1149px] top-[206px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.55px] h-[3.55px] left-[235px] top-[362px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.60px] h-[2.60px] left-[1246px] top-[1px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.94px] h-[2.94px] left-[788px] top-[6px] absolute bg-white rounded-full" />
        <div className="w-[4.19px] h-[4.19px] left-[527px] top-[365px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.13px] h-[4.13px] left-[201px] top-[53px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.94px] h-[2.94px] left-[765px] top-[13px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.11px] h-[4.11px] left-[1254px] top-[30px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.85px] h-[3.85px] left-[107px] top-[316px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.72px] h-[5.72px] left-[1305px] top-[8px] absolute bg-white rounded-full" />
        <div className="w-[5.46px] h-[5.46px] left-[102px] top-[316px] absolute bg-white rounded-full" />
        <div className="w-[3.77px] h-[3.77px] left-[1322px] top-[334px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.84px] h-[4.84px] left-[1370px] top-[317px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.55px] h-[5.55px] left-[945px] top-[258px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.24px] h-[2.24px] left-[266px] top-[362px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.89px] h-[2.89px] left-[987px] top-[156px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.46px] h-[3.46px] left-[10px] top-[168px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.67px] h-[5.67px] left-[441px] top-[291px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.07px] h-[4.07px] left-[962px] top-[364px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.57px] h-[5.57px] left-[599px] top-[293px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.41px] h-[4.41px] left-[358px] top-[163px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.31px] h-[2.31px] left-[670px] top-[182px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.60px] h-[2.60px] left-[621px] top-[257px] absolute bg-white rounded-full" />
        <div className="w-[2.16px] h-[2.16px] left-[48px] top-[322px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.91px] h-[5.91px] left-[491px] top-[5px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.50px] h-[5.50px] left-[1139px] top-[274px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.74px] h-[3.74px] left-[24px] top-[177px] absolute bg-white rounded-full" />
        <div className="w-[5.57px] h-[5.57px] left-[1166px] top-[316px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5px] h-[5px] left-[445px] top-[326px] absolute bg-white rounded-full" />
        <div className="w-[3.01px] h-[3.01px] left-[438px] top-[252px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.14px] h-[4.14px] left-[554px] top-[131px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.30px] h-[5.30px] left-[1010px] top-[116px] absolute bg-white rounded-full" />
        <div className="w-[5.53px] h-[5.53px] left-[437px] top-[367px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.87px] h-[5.87px] left-[948px] top-[27px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.87px] h-[2.87px] left-[826px] top-[20px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.89px] h-[3.89px] left-[1222px] top-[112px] absolute bg-white rounded-full" />
        <div className="w-[3.77px] h-[3.77px] left-[796px] top-[395px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.09px] h-[2.09px] left-[272px] top-[103px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.12px] h-[4.12px] left-[76px] top-[2px] absolute bg-white rounded-full" />
        <div className="w-[3.51px] h-[3.51px] left-[226px] top-[276px] absolute bg-white rounded-full" />
        <div className="w-[3.03px] h-[3.03px] left-[723px] top-[197px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.14px] h-[2.14px] left-[1259px] top-[17px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.28px] h-[3.28px] left-[1244px] top-[293px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.45px] h-[4.45px] left-[118px] top-[128px] absolute bg-white rounded-full" />
        <div className="w-[4.15px] h-[4.15px] left-[490px] top-[204px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[4.93px] h-[4.93px] left-[552px] top-[38px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.56px] h-[5.56px] left-[115px] top-[303px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.35px] h-[2.35px] left-[509px] top-[278px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.24px] h-[5.24px] left-[804px] top-[389px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.44px] h-[2.44px] left-[1013px] top-[50px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.69px] h-[3.69px] left-[1183px] top-[95px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.83px] h-[2.83px] left-[278px] top-[181px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.22px] h-[3.22px] left-[1316px] top-[282px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.55px] h-[3.55px] left-[736px] top-[119px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.29px] h-[2.29px] left-[483px] top-[319px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.14px] h-[2.14px] left-[1135px] top-[19px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.64px] h-[3.64px] left-[39px] top-[126px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.30px] h-[5.30px] left-[237px] top-[369px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.57px] h-[5.57px] left-[1156px] top-[126px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.78px] h-[2.78px] left-[1295px] top-[74px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-0.5 h-0.5 left-[76px] top-[227px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.61px] h-[3.61px] left-[108px] top-[89px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.37px] h-[5.37px] left-[191px] top-[167px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.18px] h-[4.18px] left-[164px] top-[117px] absolute bg-white rounded-full" />
        <div className="w-[5.15px] h-[5.15px] left-[533px] top-[261px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-1.5 h-1.5 left-[327px] top-[157px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.74px] h-[5.74px] left-[1242px] top-[122px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.22px] h-[4.22px] left-[129px] top-[265px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.30px] h-[2.30px] left-[1305px] top-[86px] absolute bg-white rounded-full" />
        <div className="w-[2.70px] h-[2.70px] left-[1235px] top-[120px] absolute bg-white rounded-full" />
        <div className="w-[2.15px] h-[2.15px] left-[596px] top-[103px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.17px] h-[2.17px] left-[483px] top-[233px] absolute bg-white rounded-full" />
        <div className="w-[5.09px] h-[5.09px] left-[706px] top-[188px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.15px] h-[4.15px] left-[141px] top-[2px] absolute bg-white rounded-full" />
        <div className="w-[4.20px] h-[4.20px] left-[48px] top-[124px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.51px] h-[3.51px] left-[1095px] top-[201px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.21px] h-[3.21px] left-[730px] top-[185px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.61px] h-[2.61px] left-[722px] top-[319px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.28px] h-[2.28px] left-[444px] top-[26px] absolute bg-white rounded-full" />
        <div className="w-[4.49px] h-[4.49px] left-[355px] top-[212px] absolute bg-white rounded-full" />
        <div className="w-[3.69px] h-[3.69px] left-[1280px] top-[312px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.23px] h-[4.23px] left-[1114px] top-[113px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.48px] h-[3.48px] left-[729px] top-[117px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.11px] h-[4.11px] left-[647px] top-[276px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.16px] h-[4.16px] left-[365px] top-[116px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.35px] h-[5.35px] left-[94px] top-[194px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.84px] h-[5.84px] left-[2px] top-[84px] absolute bg-white rounded-full" />
        <div className="w-[4.43px] h-[4.43px] left-[1382px] top-[23px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.38px] h-[5.38px] left-[857px] top-[284px] absolute bg-white rounded-full" />
        <div className="w-[2.77px] h-[2.77px] left-[1228px] top-[385px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.65px] h-[4.65px] left-[165px] top-[184px] absolute bg-white rounded-full" />
        <div className="w-[5.53px] h-[5.53px] left-[568px] top-[354px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.59px] h-[3.59px] left-[1303px] top-[371px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.84px] h-[5.84px] left-[235px] top-[188px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.84px] h-[3.84px] left-[902px] top-[211px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.45px] h-[3.45px] left-[367px] top-[161px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.08px] h-[4.08px] left-[855px] top-[394px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.25px] h-[3.25px] left-[383px] top-[47px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.39px] h-[4.39px] left-[1313px] top-[165px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.60px] h-[5.60px] left-[697px] top-[327px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.09px] h-[2.09px] left-[646px] top-[370px] absolute bg-white rounded-full" />
        <div className="w-[3.13px] h-[3.13px] left-[728px] top-[122px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.53px] h-[5.53px] left-[203px] top-[293px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.83px] h-[5.83px] left-[424px] top-[121px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.82px] h-[4.82px] left-[1358px] top-[176px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.18px] h-[3.18px] left-[1212px] top-[24px] absolute bg-white rounded-full" />
        <div className="w-[5.23px] h-[5.23px] left-[260px] top-[217px] absolute bg-white rounded-full" />
        <div className="w-[5.29px] h-[5.29px] left-[1204px] top-[367px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.47px] h-[3.47px] left-[1163px] top-[159px] absolute bg-white rounded-full" />
        <div className="w-[5.77px] h-[5.77px] left-[1257px] top-[115px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.31px] h-[5.31px] left-[222px] top-[356px] absolute bg-white rounded-full" />
        <div className="w-[5.43px] h-[5.43px] left-[1141px] top-[349px] absolute bg-white rounded-full" />
        <div className="w-[5.62px] h-[5.62px] left-[683px] top-[81px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.91px] h-[3.91px] left-[269px] top-[3px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.51px] h-[3.51px] left-[305px] top-[310px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.41px] h-[5.41px] left-[530px] top-[94px] absolute bg-white rounded-full" />
        <div className="w-[4.64px] h-[4.64px] left-[730px] top-[301px] absolute bg-white rounded-full" />
        <div className="w-[3.59px] h-[3.59px] left-[716px] top-[14px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.77px] h-[4.77px] left-[544px] top-[13px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.29px] h-[2.29px] left-[357px] top-[281px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.42px] h-[2.42px] left-[1346px] top-[112px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.42px] h-[3.42px] left-[671px] top-[150px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.40px] h-[4.40px] left-[1324px] top-[268px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.21px] h-[5.21px] left-[1028px] top-[376px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.27px] h-[4.27px] left-[499px] top-[50px] absolute bg-white rounded-full" />
        <div className="w-[4.35px] h-[4.35px] left-[543px] top-[359px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.25px] h-[5.25px] left-[1245px] top-[296px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.52px] h-[5.52px] left-[360px] top-[98px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.46px] h-[4.46px] left-[741px] top-[358px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[3.90px] h-[3.90px] left-[1262px] top-[184px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[5.75px] h-[5.75px] left-[552px] top-[335px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[4.95px] h-[4.95px] left-[120px] top-[178px] absolute bg-white rounded-full" />
        <div className="w-[3.28px] h-[3.28px] left-[1337px] top-[293px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.43px] h-[2.43px] left-[233px] top-[310px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-1 h-1 left-[218px] top-[322px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.68px] h-[3.68px] left-[984px] top-[8px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[2.44px] h-[2.44px] left-[832px] top-[55px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.93px] h-[3.93px] left-[1105px] top-[209px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.08px] h-[4.08px] left-[957px] top-[23px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[2.33px] h-[2.33px] left-[1066px] top-[390px] absolute bg-white bg-opacity-80 rounded-full" />
        <div className="w-[3.25px] h-[3.25px] left-[737px] top-[118px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.18px] h-[5.18px] left-[202px] top-[19px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.05px] h-[5.05px] left-[466px] top-[17px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.85px] h-[3.85px] left-[144px] top-[153px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.35px] h-[5.35px] left-[233px] top-[330px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-1 h-1 left-[730px] top-[179px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[4.46px] h-[4.46px] left-[1156px] top-[342px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.22px] h-[5.22px] left-[1275px] top-[204px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.50px] h-[5.50px] left-[38px] top-[343px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.14px] h-[5.14px] left-[867px] top-[113px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[2.19px] h-[2.19px] left-[1277px] top-[314px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[3.74px] h-[3.74px] left-[1136px] top-[197px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.37px] h-[5.37px] left-[34px] top-[226px] absolute bg-white bg-opacity-60 rounded-full" />
        <div className="w-[5.93px] h-[5.93px] left-[727px] top-[272px] absolute bg-white bg-opacity-50 rounded-full" />
        <div className="w-[5.29px] h-[5.29px] left-[277px] top-[43px] absolute bg-white bg-opacity-80 rounded-full" />
      </div>
    </div>
  );
};