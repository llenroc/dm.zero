using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Contents.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace DM.AbpZeroTemplate.CMS.Contents
{
    /// <summary>
    /// 内容领域服务
    /// </summary>
    public interface IGoodAppService : IApplicationService
    {
        /// <summary>
        /// 根据栏目ID，获取内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<PagedResultOutput<GetChannelGoodDto>> GetGoods(GetChannelGoodsInput input);

        /// <summary>
        /// 创建内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<GoodDto> CreateGood(CreateGoodInput input);

        /// <summary>
        /// 更新内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<GoodDto> UpdateGood(UpdateGoodInput input);

        /// <summary>
        ///  转移内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<GoodDto> MoveGood(MoveGoodInput input);

        /// <summary>
        /// 删除栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task DeleteGood(IdInput<long> input);

        /// <summary>
        /// 获取内容信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<GoodDto> GetGood(IdInput<long> input);
    }
}
