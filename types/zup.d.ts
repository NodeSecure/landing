declare module "zup" {
  interface ZupData {
    [key: string]: any;
  }
  
  function zup(html: string): (data?: ZupData) => string;
  
  export default zup;
}
