// https://www.npmjs.com/package/react-countdown-circle-timer
"use client";
import {
  IconBookUpload,
  IconCirclePlus,
  IconDownload,
  IconEye,
  IconEyeClosed,
  IconReload,
  IconUpload,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import "react-toastify/dist/ReactToastify.css";

interface Book {
  id: number;
  name?: string;
  author?: string;
  saga?: string;
  url: string;
}

const BASE_BOOK: Book = {
  id: 0,
  name: "",
  author: "",
  saga: "",
  url: "",
};

const MOCKED_DATA = [
  {
    id: 1,
    url: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2016%2F09%2F9781408855652-png.jpg",
  },
  {
    id: 2,
    url: "https://res.cloudinary.com/bloomsbury-atlas/image/upload/w_568,c_scale/jackets/9781408855669.jpg",
  },
  {
    id: 3,
    url: "https://static.wikia.nocookie.net/harrypotter/images/f/f7/Prisoner_of_Azkaban_New_UK_Cover.jpg",
  },
  {
    id: 4,
    url: "https://static.wikia.nocookie.net/harrypotter/images/a/a3/Goblet_of_Fire_New_Cover.jpg",
  },
  {
    id: 5,
    url: "data:image/jpeg;base64,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",
  },
  {
    id: 6,
    url: "https://m.media-amazon.com/images/I/81p2+4nYtkL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 7,
    url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGBxQUExYUFBQXFxYYGBwZGRkZGRwfHxwZHRkfIRkhHBwfHyoiGR8nHx8YIzQjJysuMTExHCE2OzYwOiowMS4BCwsLDw4PHRERHTAoIScwMjAwMjIwMDIwMjAwMDAwMjAwMDAwMDAwMDAwMDAwMDA4MDAwMDAwMDAwMDAwMDAwMv/AABEIARMAtwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAAIDBAYHAQj/xABAEAACAQIEAwYDBgUDBAEFAAABAhEAAwQSITEFQVEGEyJhcYEykaFCYrHB0fAHFCNS4XKC8RUzkqJDJFNjssL/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAApEQACAgICAQMDBQEBAAAAAAAAAQIRAyESMUEiUWEEcaETMoGR8MEU/9oADAMBAAIRAxEAPwDjVeUqVUwEaVKlSYCpUopRSAksiTHy9eVNbfWmxVzDW87mRvofWKtW1QFezbLGAJPSreHsr3ZY77bcufuKl4VYK3UzAjnBBGkGakxE94VWTmI0A13B0jU6b1ajQgfiFAgLtGp6nX5elMS1MnpSKkGI1mCOc1Zs2CUzcgZ+W9CSAit2CdhVzAYPMLincdfTT86L2rIHKABQvhmIJeeTHX3/AHFUwBl+wyHKwg1JlyCftefKdR9KNcSw4JkkgKssAdyJ29Y8qA37uY+8x61m1xGWMEhZXjdfFHlsT7aVHdw8KzfeA+hJ/Kn8Iu5bqk7GVPowj86JYzAOVgAv4z8IJPwqJ+n1oW1QAGrNq3IlfiUSR1A1JHtUDrBipcG3jXzIB9DofpUID3E2vtD4TVer+UpcKkaHl0mPz0ry/hRy6aVVAUaVS3rUR515U0wGV4aVexV9oR5Sq2mMiy1rIhzOGzlfGIEQG5KeY8hUdzDOoRipAuAsh/uAYqY/3KR7VmMP8JvEcKxq5jBv4XSTG18nT/aP/EdKLdicAMRw+9Ya5AOLslbebJ3tzuLxW0HPhtlyqjM2kqOcVnnxlq1YFhSbue7avXgQUA7tHAtgzmJ/qXJbT7MVb4RxENZvWBaCo95bvxE5codVQT8QCuwk6nTpVRjboCDieJu3LuXEBgbf9NbRzAWgsAW1Rj4AAANdTEkkkmoMbeKqCpKkEQRpBGoIjbajHGeM98tnvrK3LlsgG8XYPdtq2iXCPihYUP8AFA3NZ/E3QX+HwTOUHlO2Y67aSfWt6pAdI7cXblluJXLzm5ZvXTaw9sNnCYhGRs5IkYcqmcZSVZw2xAJAPGzawuD7lijYrvnuuhKscl3u7aZhqFUAkrMFmJMwIqYXtc93F33a0rW8WQL1gsck6Q4O6shlg241qXGY/urItvaD20YugzZWRmAzm28HLmgZlIIOUEAHWoS0BBbLX+H4i5eb+vhL1kWrpJzlbpcNbLbsFKB1mSviiJNa3AXzi3tXZOTidhsNiBqVTF2V8NxlB0HhttEjws5rn3FOONeRbNu33doP3hQEsz3MuXO7H4iF0EAASdNST7w3tBds4W9hlMJddHnXMjLIYp/aWU5SeYEczU1Yg52h43eW3eH9S2bx/lrdsk5kwlg5SGAbd3AUkaEpeH2qdZluGYIEkhb2KgE6f/DsP9zfM9aFcY4jcx2Ia/dCrIHhXQaDWOmZiznzdqI/9VRbFmw1jP3bXGUi4y63MuaYERCLHoaaj5ALcBVmw+PRTDNhGG+/9W0BPzI9z1oT2fOFfAJhsWBb73E3+7xEa2bi2sOBmHO20ww5QDykXcBxUL/MBEVe9tBMmZv6a5lMgmS5lFJnfXrQHtTiFFtLQQCLt27nDHVnCK4K7DRLcR59dCcfIybjPD7+Fwd7DXsylMVbOUMShDWrkOvJlaAQfKjPbHiBw158BadktWUtZCjFS5NpGe45WM7sWJnpAERWUxfaS9dwtvCOQ6WnzW2PxKuUjJPNBJIB2k8tBK/aIXbdtMTaF1rSBLd1XNu4EHwoxhldRsJWR1is1oCpx1r7XBcv94WdVh7gMuiqFUgkeMZQBm1mN6GA0Z4pxF8Zcw9tURO7tph7S5vshmK53YxJLmToPIUJuoVYg7gwfUUAGsfGUP13/fv9KiEECT6GvMM2ZVB0BXKT6Egfp/uoerFCVPWCPxq7AvYjD6j9715T8GSfDuNwa9oAEVLacjUdCNQDoQQd/InXlT7qCRl9v1Pymtd/C3ibDGLZkZHDGMq/EqSNYkaA6TUZW4QcqsaVujH38O6EB1ZSRIDAiQdjruKJ4Xs9i3td4mHcWozd4QFBXrnaAR6V52wuXDjL4uOzst11BZiYAcwBOwHTlRzsdb7zhvErZMwttwP9OZp/9B8qzeRqKkvj8jUU3Rk7VqQdAREzRfh2HuKFFoBw6hi0MoUx4gZ3jrseVXuxXDEv2byEAXMyiyY1ZslxmSeYKrt1ov2UvAXrNvukdbjIjC4swGdc3hOk5cw1HM1tCad12g49A57FrUupIAK+IwCSIlQNTG49KzGIXUxsNMzaT7VvuJi3dXHBrFu3/LXItOiZNDeZVB5NKgfjWcwvZbEXAb1spbVZcO1wJAU6sDyAI38qr9WNNydeAcX4KfZ7G27NybveNbIaVTKCTBC6nkDrRCO9QgAxGdh93mSQNIMDXyqjxTgF7Dql1jbuWrhIW7acOhYfEpI1DeR8/Oo8LfIITNpMRPXf2mnae0yOtMtWbmG7ooLbrdLSLmjDKdlKzO8ajWiGA7D8QXNNorbuKMxdlUFQQwkE5l1AO3LWs4SUIIMMpBHqDII+hroHZviVzE4TiL3FtguouHIsAnK2clfPKCTzM1lmcoRuPv532y4U3sEpwJlVsj2buTVxauByo6ldDHtVNrQJor2PhMXh2UfEXtsOWUpp7ZgtB8digmLv2eS3bioR0DGB7D8KqE2puEva7BpVaLBQaESGH2p8+WmgiNNapcXBAzkK5GY5GAIyshUsBvIMEdCAaPW7mHFm2xtM7wwYi4VEhjGmUycpXYxtprRU4DDriLVsYbvdFuAF2JgyWhdA2gPh1naKU8qXpafn8DUb8nJhVi3bC3Mt3OoBhwB4hG4ysRrPI0e4v2MxStmt4a+yNrpafTQHptJPyNU7/ZbFJae5csNbW2oLF9J8QGg3nX5A1PJdWiafsBDVj+Vbu+9gZM2SZE5on4ZnbnEVBFae12SQYcYi5iUVYQsEQuV7wSoMEaxv0IIolJR7BKwXg38AEAROomTqN9eVQ8STUN1EH1H7j5daM8V4KLCWitwXLd5CyPBWQZmVMwR4ai4His9q7h8qEXApZioLKEO6tyJ2+XnLjJSVoGqdMg4RZItkndj4Z6Df2/xXtW+JXVAgaAaew5fh9OlKrEBb93QAcx/69PervYvE93jsO3/5VX2Y5T9DQ3ELDEdPyrxcyFWBE6MIIMa6TB0Omx1oyq417gnTs6H2t4zgMPjLyvw0XbuhZ3vMAxZQZCQQNCNRrvUnZLtOuKN/DLhbFi22HuEC0sEttDH7Qhjyod/F3hr/AMyuIW25tvZtlnCnKGllALRAMBd+tCewnFbGFunEXXeQCgtIklww1JYkKoHTeuHgnitbdfk15VIscHxrYXC2rhsBy99nRnzhVKogRvCRmmX57A+dbKxglbHYW+hQC8yXGt5lzI8Fj4JzZTEzHM+Vc0u9014dybhtgADvYzbbaaAdBWxwNx7ZFy0xV4iRH5iuuGBuLkntkqRd4jiHxYxOHZ2Zhda7h5PNC0oPIodByIoR2IPevibJfKLmEuCTMLqomPefarKrd703FnOJeVAG25gCKm7K417uLuDu0CizdLG2pAL3cmrEkjM2TbTY+dTmg4QaXWn9mNO2ihxrCCzwyxZW6t9XxNy6LtucilbeXJrrmMltQNjUfDcVdxFi7he8YsED2QTuLY8Vr0KwVHIrVfsjjUXvMDi/BZunUtobN9dFfX4dRlaffQGivZ3s5es4ywbsCLlwCCDmUW2IdSN0Mj51GRqMGn2tr5ErbVfYiv8AFbmBwq2Eb/6i8RcuZgGFpYlVCtIFxtCZG3tV7+G0A3UInPYJIPOCJB/8orJ8XvG5iLrEzmuv9WMfSK2HYHw4gCN7bL+B1+VVOFYG321bCL9SIcBj8NYcXbdq6zDVQ7KFEjqBJ350St8CvO9m1Yumw19f5rFXkaLjB2JVEac0CGAUGNZPnncXg3tmHRl3AzKRMdJ3oqOPp/LrZuBywt5DdtFQ3dTIteIHTaSI6awZc8WlKO7GpeGe9pcYl21h7hyq73LtlSGzBltuQhLzDGIlp1LHyp/E7zW7uHuL8XcW433hwfxrM9ocQb3dC2gS3aEWbY1ymZYkkeNmOp09qJ4/i9wqVuufAAT5ToPTePcdaI4muN9K/wCn4Dl2GOyDE45DmJ/o3LZkkyN5/wDUfOufO9y1L2jIuIAQQCQM6kg6eKHQCfKt1/D9S2IS4JKKrSw2EoQJPKTQLifBmFtxlZLlq4W0Hi7ttWgaBubAc6dL9WS+EJ/tQa4xfxDYbC3Wde7XDrdvtcRLgbPdVQMrKxkhhGkRVDgiWLycTUkJYa4lxFtgAqgd8uVSIErlFT4q9gsb3DfzF20qW7dh1a18aW3BynI5iWgjePwqcGW1aTFJntp3tq4BmdVAcn+kokztPy1ia5+Hoeqen18jT9X+9iftLbQ2sI1sjuLYKrmBnOGlkaNNgIgjQH1oIpRA3dhVznMQDyJ0AnZRsP1q92W4iBOHvpnw90lWVTOWNriHqDzB+cAVU7RYfDWiEs3jcJLNcYKwAXw90IYDWM8xI2rbFFx9P5+4pO9grG3xP3V28+Q9taVRtaDBgDsRJgyfTpE7Uq2IG4vDxL8iNPUnX5CfpT+BG9burcsnK4mGgGJBBiQRzozw/gr3so5A10vsn2BVcrvlXmJ5+3Sqmk+xpM5jjMJjL4i7evXATMM7ET5KTA+VV8R2eclItBMqANEnMw3YydCeg0r6CHCrIJbIpPUqD8l2HvNeHB25EJbE6DwL09N9qlJLpD4nCOH8BuW2D5AY5MoI2jUHQ1qMJhjlE6afWP2K6YcJZYw6gzvoF+g3odxPsmHE2GHoZH4CtIS4vY6owTgfSsFx9Bnn96V0fF4QoSrAhhyNYDjyjaPEGJLSdQQIEbCCCZ8/KtZ+CZHmFNj+XAyv/MZzLSMndxoI3zTRLg3FThT3iWrbNtLBpAO4EMAJ6kGgOFaCJo3g+HG+SqmMqltp/wCP3oawyRjTUuiY3eivayPcJAFpYlR4n1A0WTr4jzOgmtDa4pdtp3du4yKTJC6a+o1+tDbPBYNrK5OYW2IKEQHstdUDxHOYRhGmsddDXEcADdKwVAth9F10shj4Z0kzz50k4tU91v8AotJgt7+YyxLb7ny01M84qg1/x6QYIOuo011B0NGeIcHzZGQ5cyWwwykQTh+8JEHxE5X001I66CDhMjsobMBsYIkeh1FaRnF6QmmT2rniDH+6Tlgc5OXSF8tNOlWsVh++tOAMrQJgnxAEESJ2BA09Ki7iMviBkTpOhkiDI30nSdCKL8KwZJYyBAJ15+VOlVglZirdx7DZgJX7SNsevv51tbVkWInwlgrZZBgEcyNDuKi4pwBL2oJXQ6jcabEc9dPr1objuBOtlbVt5KmTBKkk8gOg2oaYVRYxvDMPbsXMufvTczKBqoVhqQNCNjoJgkctg2E4WXUsxghiI6iBrPITNR4PE3LYuK5bweIZpkeQ+lT2+IuUS44aHkDp4IDRrtqKy40wsttZSyrMDmbLExAHMqoPIfXehfE7LXYZVhh5QIG3786u3ibyMgIVYBBkFuRMgbQJ5z9ai45hbatFl2dEyqCdM+UZtR5gkT90Ur3QFFLDLaK/aMMee53PyifKlUmImcm6sJHmJnU+W0eVKnQjtnY/s8lq2LjgE7KD+JrRcQxaWFLv4miQvloPxIFSIBCLG5hflWd7XOHdwpMjLOvISNPKT9RR2zRFK72mu3S8uEtgAQgMjyUjXNvvppyqI8TuhVFpzlMkMWl2E/aPKNtIqXBrbt2ouIIQli2YiCQAY5EiOfnUdritjN3XPwwMp1BAM7Tqp1mna8ItJDcI+JLeF15k5wMvXU8tPOjVjjmTLavpkZhuDmTNmMjN6ZdYjWmW7Ki02WAWAkAx4OWnnp8hQ3jGJNhUYqCrXQjD7QhXJKDaQVU/SjkmJrYU49w9L1tmJ8agkMOYHWuPcT4P3rLFxVNy4baBg2ryIBIByg5lE9TrA1rof/UGsPZbN3mGuv3cwT8Z0IjVPtSDoMp02ByHbwvhL+RVXwP3ltiCSrNEMNcpIhSJBgiaG5VSIaRj8Jwu8zW4tMQ/w6eh16bg6xMijOA4VdInxKTbLoARLAXApB1ldZ3/ALaF4XtDdW5aaEJtAKpYMdFAVDGaAQABKxPOaJ2+Jll1VDCMn2vha4bkfFyYnXp1qZc37EaJVwtyLbAuWzXMykxk7soBuerjpFGmtO4bfMi7CSdDlI09RQL/AKy2cXCAGDXnBUHV7o8UyxGXbTy96J4S/wCFgI8SwZnaQdNeoHyqocqaKVDMfw+4rGWZggViRMLmUMN9iAfaD0p9/hWWYJY946GQBoio2YmfvGZ6VM3EGOYZUGZQpgHZVyiDPSPkKT8QYyMqwSxO+uYANz+6p05iiphoiTh1zSUI1jWOTBdv9RA9x1ojbtFQJEA7bfhy0IPuKqrxK5rruSduZAGnlAX3VTyqT+aZlVTsogb84nc+Ww036mtMbmnuh6LBNMtJ449vrTA9PwreKTWz2BS7R4FXsvzaDpBkRBGvOenlWMwOCLhhEEgx7ax8h710K7rvWM4pbNo7xBMEb/dPy/Csska2TPTPeHjKyAKVhYJzEyw1aRHhBExvtVsWxBt8mEoQJ8SkkAaQT8RjfYCai4biEuTETrmX13I8qqC6ULLcByqSCeYiMreTRqCNwNetZCInuOswAyz5aHn+/wBKVPx1xWOpGbSWGzA7HQGfl+Fe0CPogYkAs3/27bR6msXgsWxvtqPHIluWxkee0VqL6nx6fEjAeo1/I1geLBrd1W6qD9I/KnFWbRCfbnGp4cPbnKujebfaPpyrP2b9xWzBoBInLoSfMjXlTcVfzMWJ1Op9edT8FwjX7i2wdz7AfaJ9h9K0SSRXSNF/PHuLOIYky/dtuSyjY+bAEj5Ub4dYs4lJfxLGYHXQnmOh3H5VkuP48XGFm0Is2jCjr1PuaKcFLr4QYAGp/tnz5SYrNwtWARwvDijPaUG5auCYyyAZEHfTX5x5Vkv402WFnDOwhyhQj0Jj6AV0PhTkAEdd+tc+/j9iv+wvMyQJ6E6x7xUxVOiZ9HJGNE+H3p05H8aFuat4A6itDBhJ9qN8PMovp+VVcDwK9eTOoVVgEF2C5vSeXmYHnRbBcOuWxkuIVYCYPMHYgjRgeokU4vZSK9eipbya14qDdmC6SBzOsaDnrVsZGamsv+FXuz2Hw90Ozm45T/41BkjqSJkTppFS3uJKpItKtofchnj/AFage5JHSo5U6QrGjBXIlh3ac2uEKAOuup9gaWHw2bW1ct3BMDKwBPsd/aapXbpLZgIb+7dv/I6+wgeVTX8PbvBTaW3YdZMFfASRoJHKdQDttJFEpTW0Oye9aZZBERvtWN7RD+s87GI+VbHB+NYYBXtnK6+2h8wddfKsr2ywZF4wYDAMPXam25RsctozFq4ytmUkEHQitNdxodFW+htu6aMRAajvC+zeFwlq1fvf18RcCm1h12k7EjfKDGp60C/iXxF7uLKsZ7tQgjl9ojy1J05Vh0c8cvKaSWjP35TSfh0B+UjzGs0qju6rPQ6+/wCyPYUqRsfT2DcXEXygj5a/Ss/2g4Kj4ZbmUm5bZkPvmyz1gxp0JpnYbjXfWwhYT9nXXQbf59a0tlRL27g8Nz/9v1n8KpOi0zlOJ4SwUPO7EZeY9aL9isPN17YIzvbcL6xt5TRnjfZ9mzIoiTPrAjfloTQYcPNgkg+KCBl5ToTO207da1u1RYRXsratf9/E20f+xfEQfMDWrmFwxsgwwdXgSOYg/LWKD8GwJuXHcyYgCZMk1pbOCKLDaSfh6Unrtkq2wjY0UZiAdoGsCPKuO/xSxYxGJGS7nA5R8HLfcyIPSt1227UJhbXdW2HfOsL90HmT8/UnyrE9lkHetfuDMVV7hLeKSFOpnfWDUR9xSd6Mhd4FfGUC1cJIkAKdR8tqXDMC3eojqQC4Dek6iRsdxUvGOIsb9x87BmJzMGMmdDr+9qG2rZAzB4PKJn51bTM3R0i3x5LgAYZZ6fQeUDQDyFaHg+JS9hylz4fF3Tkao88yB4VYgiNiSOdcuw2LD+EZi5gwATJ1zEACdSa1vCrpw1slnCwhQtrIBYs0jWTrEGIBM8qhwd2Wh/FU7tXeAcokA7GszjuK99lflt0ykco5eVO4hx1rzEfZEEA7wdDPuPrQvND3BygN7iB+daibsLcIvF2YgaG34uk96o/ETRayNaHdnrWXDg83Yk+ikgD0kmiOHOtNExCfC+Fte+GI6czpJgb7Ueu9n7Vrx3W7sEeFAMzmPLQAeZ+VXOyd+1ZsPc0706An68onQfSgd7EF7hZjJNEbkzJcsk9Oki7icPhCAR3q3AIDgKRtzBII1nSSKz2K4ZhMRftDEXbwZUZjbS2IMayHLEZdDqR+daW3wsd139xot6fCCzSTtGw0nUkCYFD8XwgXSxwyuuYaG4dQBoVXLoc3OYEA+VKdLojLJRWm/wDh5gjYOMvtZxkhrMGwylHkFTbRGiGGjAxyOx3rlHHMK1u9cRiCwYyQZ1nXU6mux8TwJwly29oAXrxAFyF/poklgejFQpLRpDda5l/EHuTjLhsNmtnUH9/L2msmrRnhn6+KXgz9o6H6+n/P40qYpI1FKpOw1PYjtCtm4BdLZJ1y7x/zXWOHds7V4DNGYjXWJ8yNp9K4BYGs9KK2eN5BCaefM01saZ3/AP6rZujKWXpqY386gv8ADrfxE+E6D9ZPKuRcP45BV31gSwPw7esjWOtVH47duOyqCIJGhPI1VNFKR2XHcVtYZCudVeNJImfurM+8Vku03aS6llLiaC43haQSy6yQu9vWN9TJoBw7gYKd9iXeX/7aKQGYD7TFgcqzoNJMGi3C8PaSGCT53ctwKOYRSsT5xpSodtmRwvD72KvTDOSZ5k+9ajG4D+Wwd52Zc2UWwimYLEbkeHYbAmrXFu1D3SUtwidFACj0AjMfM6Viu1HGGdVshiVQkmdizc/PQKKuhNUgBcOpnU1c4fw57pzEkJsW/JRzP0qxwrg8gPcmOS9fXoPKncX4pP8ATtmFAgkch0WqfuJRrbJcVj1tKbdgZQNHcbz0zcz9BVC7xAsuSSBBAE6dAPLkZ5mTuaisWGuKVRdBzJgfOpbHC5+JvkPzP6VOxOVlfh9z+oJ5yD+P41ZbUuwHxLA6mWUCB5masPwV9WtLmQLrGpHUxudPxrXdnOyrLlvXV2hlXoYhZ/0g7dSf7RNRTCn4G4LAlbVpSPEtsBh0Yksw9iasWcJzojxK8lm2zuDCgkgCToP35VgsR2pxVwlrfgQf2qDAnnmBk+lOcow7L41o3dhMo3ptwQdN6yXZztM7X0t3SGVzGYmIMGIA01MD3reWrBbQCrhJSWhx+BcHxDC4FLMqsYIE6+oG/pUb4TEWjcYRZUSneXCyhVPxFGjfzAnXSljjk0ESNSen61n+1HHWxGW3Jyr4RMwDrm89/wAYqJ9nLmxvlryRdrO0ds22s4drjs4UXbjMw8KkwFTZRr8t+dYl1ABO5/OiOPGVff50JuPNSKEFHoiuNPrSphpVlZsOYwI+dPsWtQSDHpp86aGFEcHfOR8piFJk8v8AJ2Hz5U0l2xlt8DNsb+MqRHPnrpqImtbw/gOHsFBduZnYgELoBrBljv6AfKst2bxDXLqZySocEDkJbX61rcQ+GskX8SO8cQVtAwBzBc8/9PzmjbK0Pt3jdU33ACuSLS/dXSdfsqPCB5eWoniHEy3hU6df7vX7vlzqHj3bK5iiEFtLagQoUaheY9I5RQHGY6NBWiQN0XsdxIKNDVbhODznvbg0+yD+NVeFYU3XlvgXfzPStATAgVVDir2yhxzHZFyg+JvoOZrOD6VY4jiO8uM3LYeg2/X3puEbKcxExsPvcifIb1PKyJO2Fv5qEWzEZdXjmx2HoogR1zGvbWp9dKD2rxB11nereGxEnzoJSNJwHiBsOM21b3hvFUdRBrmo8VuRuNPbl+fyqzgMabZUT69P3vTUqNYto2vaPhxxFh7YgZ9iT5yPXUbUB4JwW7bw2/dZptNbYAtnkE+I8iOY6+U0f4NxAMok/Og1/tL8bjMwZ8qqCIybAhSIzTzOup2rD6qml7nRjW7IOy/YgfzGcq2W2c6kzEkeACRDQfFI6AVv8PhMgJ5gfXlXP7PaYW7qd0kDvV725J+0fEdNwBPLlOu1dExt7wEjcjSnhncaJlDizC9pcSUViSQADpGs6/8AFc/u8TdmkHKOkCt32nuKbZBPxTqPff6VzZzrVyZyy2y3iMTm1NU2elceaaalyEkeRSpyKSYFKoGLfUmrllv6ZtqJZmG28dI50/hvCWuanwp169co5+u1GRjrGGEIJaOWrH1b8qqMdWxknDrX8sDduACB4FMat/c3kOQ60CxmPuX7k766fqak4pxNr8QI6j/NEuA8LQRcu/8AZXVut0jXu0+7/cdt60TvoGyOzhhZsG63xNEE7mdvp4v/ABoJq7QNyaI9oeLG++nwgnQbD35+tD8F8XoDVoSNPg7IRAg+yNfXc1W4hioRyOhj30H41St458pHrNVsZiS+VOsE/l+tOWkaSZVweGNxgi7n6UbbhACeQ6jc1HwsiyEcjV2POPAP1JPyo/aljGkTz9azVJ0TFWZO/hIOgp1uyV3EGtDxLAgsD86oY23A9KpqiqG4O5oRUkQa9wiqRqCDVhcBcJ8IzDqNqVB4LNniWW2xB2WB/u0/CT7VDh2hNtlgR1zTr7Ej5UrmDcoiAQSTPh+JgW1J6KpHkBJ60sINAN64PqJb/B6H0sPT+StimyoQPIe87+u/zrW9heMg4d7Nwz3c5Z/sIMAehkekVlMUomN9as8MwLrdJyvlZbgjLuApIgnSZVYPWKrDKqZOWL5NAnjvF2diqKAkkA/ifLX8aATWhs4KVuloOVNY3zFv8E0Acan10reR57PFp0U1BNSNppPrTT0TQ6womW0H72pVFnNKnyQUE+L8RzeBNFGny5Ach+9OYoV6za6aDpSTepcuTGOmdPzq/g2L2+7N3KAScp5zHPpPKh439Kv4VVzICd9WPSdv1qo+4iG/hwumYkxO2hHkZ1+VLAbn/T+YqxxNcsqZ8DAA/wCpQSPOCI+XuzhVknM0aRFaRlbGuxziFPnUdoTd98v/APIp+KYghYiDUOHuwwP3wauQ5MPYuySyKFkKMpg5dSxJGo5So9jRfgeFeIyBRzJJJI6DX01qljGiXEkMARA1kj/mvcHjb4YZzkTkG0McoXf0O2tYJbJRpkwYu2mYqcyMAec+c/SqFzg6tpHvNTYTiypIztPSBP1NWLnFrUgZGk6mQRp1B2P+K6IyVbNLsrYLgKIZEkii9vDHkNKdg79ptFb2Ij/FE2xFpBBYZiNNyPeNh5/jTclFWi0gMOGd6bq/ZVCmn97DMx9YyD3NZQKBlGoOk6Ex12n5b1qrXaIWs1vwl2dmEa5VaIB6tMxy0FA+LYVQxZjlZmJmT8R6yetebnipKN6e3/Z1YsnButoC8Qtwy+Ib85WD55hPrWqxHE5y2y2YjZo1LTufPOJPrNZq5hcyEr03k+f6UZwXEkXK76FoZ201O/qFzbgdOe1GOKUWicuVykjN8Qxgso9pdWJJLE8m+HT0I1rOGT6TRvtTiluXpXLAEAjYjqQRPl6AUMS3pnbUSY8zzJ8q2i7Vs5JqnSG4cHQRz0jc+XnVtuCXjq0LPInWtB2Y4cLdvv7pCm4CF0Gi6RAggTp4o205mquOvwxg77SB+QAP40u+hUBDwh+RB9KVEXxE76GvKfENAa/YywRqDMHrG8eU6e1QUQ4tjFuEBRCr4V/00PpyST0SezR3h+Eth7B1JIzHzPLToKCW0LEAbnQVo8C62wynUWi0nSSBsAfXT3pxEDeP4Tu7zLnDzrI2k+XKdCB0Iq5h4VFA5D60Kv3i7M53Y/v6VauX4tj0rWEaVspEONfM2m5pmKTKwHQa+p/YqXhyZnk+v+KhvvmZm6n6D/Ap3ZLNVwq5cNhcjHQGRr7bGqGIzltZJOp2+ZIqzwbFZLYOUttAHU1fuXy22GJPOVNS1sdlbhFpACzCANwfPn51eW+62SrBT/aGIMe8702yA4E28i7H1HIc6S/y9qZBbn/UJgDykgfjTV+AJeH49YnLljcnafID8Kke4yqSTlmSWKgOZ8o8K77/AFobY4jLDLayqDOwmeR3kDnyrziHeXiBqFkZp6UOVIqNst8PTvHtlUOU3F8Z5w3iP41d4y/9UeML5kTBOm3oD86ZwW6DikzTkQMQPsqPhA+ZGp6UF47cZsQ5B8IPWJk6en+a4MmRSyr4R0wg1jfywthlQTbL52uTrEDNGgH76UD7RYcgJ4sqhiDuBr4ht/v+VVcTcuqFu66GQeQgmPM7H51ocddV7AugfGhMHky+KI9AR70KXqteR8LjXsZe3hM42ypOpBnOR0J1IqXGWVbuwQVtqyh3AJyKTz9pIneK9GMhFkSWOw1KiSCAOpnaOQro3ZMKti0ihkOVS4AAYu5BbM5HxEwoXSAo5ianNn4bKxfT89L7sDcbBCZYhVkR90aSOokESOlZLFJlaOR1HnWx7aErffKcyENcWOatqw91Ob/YOtZPGEFVblAB8vMfvaunH0cjKecc/wB/rXlR3U+dKtSQXFKlXkVn9hD0eCCNwZqxexJeTMSSWHUlif0+QqpFOQU43Yh8057haB0FMHlvWj4Z2TN0QLoW7E5WXQ+jAk+vhraT8AgZhGy2nb2/IVBgbeZ0XrPyj/Bp76W8vn+BqPDuVuJHIr9d/wAaa6B9h7gFssuQEglSJHI6wfnRCxw26ILXCNP7oPzPKqfATlJPQx8ya0NqxbVQSRvpm684AgmgaGjHsq5M6tzLbkz584+VUMRhjdIa4QcpkSdBVm93IMZI5nfY6RE6D1qncvKdF0Xb59BzpciqPLjzBKyNQDMSJ0gcvX9aZfxFwrC2j6Tp71d/k3ZRAVY2nU0K4q1xSFFyY+IKIIrHJJR7N8eNy6CfD8S1pHfOCQB4fNjt1nf61nMU6m6ASx1BfpG59dKOXuF3BaUqrlA0uWWDmCqMuXc5XNxZ8j6VDhezN/EXDctoEVSM9y4wCAiInUtJJAygbwOprz1ODk5aR2zhJRS7IP5a5ebOzZE+ygnYHwgjmau4s93bRNQyXDJJkSPLnEDXzNblOz4VEFs21gAu7L4ix1MZhKqBsg10Mgmh+N7Oretm5cuGyjOCGZQWIA3ALLGYydTOm1c7zpNX0bcFx1/Jz/D4NlvDIxGUi5bjKSGgkfEQsKw58gTXTOHC0EsIsL/QS6VLEsFILEs5OZvGcs8gBEaCorfZ2wUHdsbt1AAjZVTKTEs25eN5J03GsUYxWCWwL19lVT3QtJprlUQsnlsGjlpoOc5cyyaM8a/Tdpmc7S4dLyrctSMr3Lck/FFstMdJY/KsJatk2AT/AHMPqYHvDVseEXUuNato+b+trzlXyqD5CdPl1rO4m0Etm2dCczfK4fw3+dengtQSfZ5uXc20BMs6THn5cv0ryvWOuun5Hn7Uq6jIFW7c09kqNWini8aSokYUNS2VzGNNqSMxBgTzPkBUdtiDI0NC09DC/DMAobMzA5Tp0Okgz7/MVaxuPykFGhgZBHKDy86DXmOQeI6+dQW6btOmFBHH4rvWdzuWLHzJ1P1mqaHxg+a/lSstuOopmbxTWi6Qno0OBaGPQ6H15H50QF108cAAyJ3bc7T+AqhgyCxHJhI/fypY1WBGuh/HnSY0Xb90OO6toWuMRqNTPkBvRDgnZq48Mbni5CM0edWex3DSXQIAHbmw25kweg2H/NdGwvZu2IAZ505xJA5xsOcV5v1P1TxvjHs7sWGDXKZhG4Hdclc91sphgIifOBFUMH2adsQ1u2GlSCxJ+EDKTJ23/KurnhQw9khEDQfCiEyzH9SZ0AjWvLWHVx3lpA7SAyLcEAfeMEk+XlXPLJlmraN45McVroZwXsuotob0O+sRsByn70bmi13hvhywMvJRIUdNthVrCYlWBABBXcERH5H2oZb48DeNi4DaafASQVccoZT4SRyaPKabwQSVXb9jjlmyTk231+BJwhLUscgQCWJ0AA6k8gPwrH47tzg+9ZTh2u2Yhn8Mx922fsepB9KyP8T/AOIz37jYewxFhDBPO4Qdz93oOe55Ac7vY64xku3zj8K1xfRY0uUlt+H4Innm32fTnZ5+H3bU4Y28o1IBysv+pTBHuK5t/FHtnbYLZw/w22aXzaljzXnyOvmK5xhOKEwrx5N09f1Gte3LTK5J1B5zJjy61t/5YXyil/WxwzNLbbfgu9m8TcbE23Vsq2mF66xOyKwLFjznQDzIFN4xx5bmK7xRFvOf/FtD9JofiuMXXQ282W2SDkUADwzlmNWiSdeetDq0SfZk5BjEDK5B25enL9+lKqVq5mGU8tj5ClWyloRUqQWjTBVuxZ3ZtgCYPPpSitWyWLBvAeeax78qgWkHMVPg03NbRBLZBcJiDXltoNWsWvhqn51GTTK6ZKajJqVBIplxedF0hyXkv4W8Tb0MFTINGMJeZsjwCw0g7ZqCcJYZip50Twll3OVSAVO8/LStOyUa/gmMe02ZwpMrBEkqAwLQJ1LDw+XLetxhu0oL3bZORrRhlOuYZSSEYHVvD0G4rlha9ZXNnLxrookHyFN4Pxjvcy5SCNTzzTuSdyfWuLP9Ipz5HdizwUOM/wCDr9njVvEIXvE5E07sZhJJiWE+MDaZj8albF3Vi9hgFtAQ9t9FOX7WmqkjmOoJBrk6Ym5aYXBcNvXcMRGh5baiaJYb+IFyCovgpPwsilT6Sum3KKl4cifpLTxSXhfDf+2dR4Tx61ibRzE23Se+SYCuB4gx/t5g6SI9K5v2t7U2/Gtkq2VWHeKfs65gh3II0PKqtzHWr1i7auKJu6i4jRDD4c3USBM7/hh8XeIRydyMvzMfrRjw3LlPtdGWV/ppqD0wZiWJJJ3OtV6nutIBqCuibtnEhVeweNgZH1Xl1H6jyqjSqYuhlzE4MjxKMyHYifr0NU6NcNx57ooujrJHmupP1/Kqdx+93jP1iJ9apxvaAo0qRpVkBNZtEyRy19q9xJ1I6bnqf06V7gruVweWx9DVso6uU0KwSFOxHQHka1ktCKFqrNowYprWcpDLqs+4PRuhr3FCCDWuP9o/kluiVPpVJRuKuWXmqt5cpp5Fqyn7nlp+Xyq0AG99Pf8A5qrcHPr+NPwtyDHWslrTBPwzyy5Vgem9HrGNCN3oQPnQrvEMY8XmYG1BcXbgzyb8edWeG3ZBttz29a1jpEvTo1V7i2ZJt4fQmdHgxJMTl008PUAaQdap4Liq2yxbDgMQoM3CScp0JJBk7gxHKqXC8cbeZCs78/mKs27JuySQAPKhjSLWK4p36NbGHUSGgyTBLAodR9kaeflVQcEJcme7UkkKIIUToN525+VEcLhQIPeE/ID6frU142EEvlPnMn8SaaVABsRw1wAquLgJ2Uxr5gmh/GcG1sKrgAsQYB5AGj9gYdmLWyyt0ImfnJ+tBu1V3+pB+yAPcgn86UnoGBjcSIgj5GoAK8NPa2RvWDdskaa8pEUqhjH2bpUhhuKlVdJH/FV6ktNHoRFXGVMQ50JMgTNeV7ZvlTSoqLGR0WOqoemX66UqVWSyC78S/eJB89a8xPw/OlSqo+RohscqdjNhSpVfgpdEFrY+lMNKlWK/aJhG/wDAPX8qhbRVPPTWlSrWPRcgl/8AJb84nzophbQJOnSlSpklu5hF7wLHhnaT+tN4jhUBswoGYwY0kH0pUqAQTt2VX4QBXO+L3C164SZOY/SvaVZ5ekIYBoD6Uy9uvoKVKpf7RENKlSrJjFSpUqAFSpUqYH//2Q==",
  },
];

export default function Page() {
  const [url, setUrl] = useState<string>("");
  const [csv, setCsv] = useState<string[][] | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<number>(0);
  const [hide, setHide] = useState<boolean>(false);

  const handleNewBook = useCallback(() => {
    setBooks([
      ...books,
      {
        ...BASE_BOOK,
        id: books.length + 1,
      },
    ]);
  }, [books]);

  const setBookImage = useCallback(() => {
    if (!selectedBook) {
      return;
    }
    setBooks(
      books?.map((book) => (book.id === selectedBook ? { ...book, url } : book))
    );
    setUrl("");
  }, [url, selectedBook, books]);

  const handleUploadFile = useCallback(async (e: any) => {
    e?.preventDefault();
    let file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const response = await fetch(fileUrl);
      const text = await response.text();
      const lines = text.split("\n");
      const _data = lines.map((line) => line.split(","));
      setCsv(_data);
    }
  }, []);

  const handleDownloadCSV = useCallback(() => {
    let csvText = "";
    csv?.forEach((row) => {
      csvText += row.join(",");
      csvText += "\n";
    });

    let csvFile = new Blob([csvText], { type: "text/csv" });
    let downloadLink = document.createElement("a");
    downloadLink.download = "Libros actualizados.csv";
    downloadLink.target = "_blank";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
  }, [csv]);

  useEffect(() => {
    const csvToBooks: Book[] =
      csv?.map(([author, name, saga], index) => {
        return { id: books?.length + index, author, name, saga, url: "" };
      }) || [];
    csvToBooks.shift();

    setBooks(csvToBooks);
  }, [csv]);

  const getBookData = useCallback(() => {
    const selectedBookData = books.find(
      (book: Book) => book.id === selectedBook
    );
    if (!selectedBook) {
      return null;
    }
    if (selectedBookData?.name) {
      return (
        <div className="mt-2">
          <span className="font-bold">Nombre:&nbsp;</span>
          <span>{selectedBookData?.name},&nbsp;</span>
          <span className="font-bold">Autor:&nbsp;</span>
          <span>{selectedBookData?.author},&nbsp;</span>
          <span className="font-bold">Saga:&nbsp;</span>
          <span>{selectedBookData?.saga}</span>
        </div>
      );
    }
    return null;
  }, [books, selectedBook]);

  return (
    <>
      <ToastContainer />
      <div className="p-4">
        <div className="flex flex-col md:flex-row">
          <div
            onClick={() => setHide(!hide)}
            className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
          >
            {!hide ? (
              <IconEye className="flex-shrink-0" />
            ) : (
              <IconEyeClosed className="flex-shrink-0" />
            )}
          </div>
          <input
            type="file"
            id="selectedFile"
            style={{ display: "none" }}
            onChange={handleUploadFile}
          />
          {!hide && (
            <div
              onClick={() => {
                document?.getElementById("selectedFile")?.click();
              }}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconUpload className="flex-shrink-0" />
            </div>
          )}
          {!hide && (
            <div
              onClick={handleDownloadCSV}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconDownload className="flex-shrink-0" />
            </div>
          )}
          {!hide && (
            <div
              onClick={() => toast.info("load images")}
              className="md:mr-2 cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
            >
              <IconReload className="flex-shrink-0" />
            </div>
          )}
          {!hide && (
            <>
              <input
                placeholder="Book Image Url"
                className="mt-2 md:mt-0 mr-2 w-full bg-gray-900 p-2 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div
                onClick={setBookImage}
                className="cursor-pointer mt-2 md:mt-0 flex-shrink-0 justify-center bg-gray-800 items-center flex p-2 rounded-lg hover:bg-gray-700 active:bg-gray-900"
              >
                <IconBookUpload className="flex-shrink-0" />
                <span className="flex-shrink-0">Set Image</span>
              </div>
            </>
          )}
        </div>
        {!hide && getBookData()}
        <div
          className={twMerge(
            "flex mt-2 auto-cols-auto flex-wrap gap-2",
            hide && "gap-1"
          )}
        >
          {books?.map((book: Book) =>
            book?.url ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                key={`book-id-${book.id}`}
                className={twMerge(
                  "cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white",
                  !hide &&
                    book.id === selectedBook &&
                    "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500",
                  hide && "rounded-none border-none"
                )}
                src={book.url}
                onClick={() => setSelectedBook(book?.id)}
              />
            ) : !hide ? (
              <div
                key={`book-id-${book.id}`}
                className={twMerge(
                  "p-2 break-all text-center line-clamp-3 cursor-pointer grid place-items-center border rounded-md border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white",
                  !hide &&
                    book.id === selectedBook &&
                    "shadow-md border-solid shadow-cyan-500/50 border-sky-500 text-sky-500 hover:border-sky-500 hover:text-sky-500",
                  hide && "rounded-none border-none"
                )}
                onClick={() => setSelectedBook(book?.id)}
              >
                <span>{book?.name}</span>
              </div>
            ) : null
          )}
          {!hide && (
            <div
              onClick={handleNewBook}
              className="cursor-pointer grid place-items-center border rounded-md border-dashed border-gray-500 text-gray-500 h-[4cm] w-[2.5cm] hover:border-white hover:text-white"
            >
              <IconCirclePlus className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
