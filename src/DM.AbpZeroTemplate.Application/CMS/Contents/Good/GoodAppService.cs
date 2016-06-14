using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Contents.Dto;
using Abp.Contents;
using Abp.AutoMapper;
using Abp.Channels;
using System.Data.Entity;
using Abp.Linq.Extensions;
using Abp.Apps;
using Abp.CMS;
using Abp.Core.Utils;
using Abp.Authorization;
using DM.AbpZeroTemplate.Authorization;

namespace DM.AbpZeroTemplate.CMS.Contents
{
    public class GoodAppService : AbpZeroTemplateServiceBase, IGoodAppService
    {
        private readonly GoodManager _goodManager;
        private readonly ChannelManager _channelManager;
        private readonly AppManager _appManager;

        public GoodAppService(
            GoodManager goodManager,
            ChannelManager channelManager,
            AppManager appManager
            )
        {
            _goodManager = goodManager;
            _channelManager = channelManager;
            _appManager = appManager;
        }

        [AbpAuthorize(AppPermissions.Pages_CMS_Contents_Create)]
        public async Task<GoodDto> CreateGood(CreateGoodInput input)
        {
            var good = new Good(input.AppId, input.ChannelId, input.Title, input.GoodText);
            var app = await _appManager.GetByIdAsync(good.AppId);

            good.CheckedLevel = input.CheckedLevel;
            good.Comments = input.Comments;
            good.ContentGroupNameCollection = input.GoodGroupNameCollection;
            good.FileUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
            good.Hits = input.Hits;
            good.HitsByDay = input.HitsByDay;
            good.HitsByMonth = input.HitsByMonth;
            good.HitsByWeek = input.HitsByWeek;
            good.ImageUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
            good.IsChecked = input.IsChecked;
            good.IsColor = input.IsColor;
            good.IsHot = input.IsHot;
            good.IsRecommend = input.IsRecommend;
            good.IsTop = input.IsTop;
            good.VideoUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);

            await _goodManager.CreateAsync(good);
            //await CurrentUnitOfWork.SaveChangesAsync();
            return good.MapTo<GoodDto>();
        }

        public async Task DeleteGood(IdInput<long> input)
        {
            await _goodManager.DeleteAsync(input.Id);
        }


        [AbpAuthorize(AppPermissions.Pages_CMS_Contents)]
        public async Task<PagedResultOutput<GetChannelGoodDto>> GetGoods(GetChannelGoodsInput input)
        {
            var channelId = input.Id;
            var query = from con in _goodManager.GoodRepository.GetAll()
                        join ch in _channelManager.ChannelRepository.GetAll() on con.ChannelId equals ch.Id
                        join a in _appManager.AppRepository.GetAll() on ch.AppId equals a.Id
                        where con.ChannelId == input.Id
                        orderby input.Sorting
                        select new { con, ch, a };
            var totalCount = await query.CountAsync();
            var items = await query.PageBy(input).ToListAsync();
            return new PagedResultOutput<GetChannelGoodDto>(
                totalCount,
                items.Select(
                item =>
                {
                    var dto = item.con.MapTo<GetChannelGoodDto>();
                    dto.AppName = item.a.DisplayName;
                    dto.ChannelName = item.ch.DisplayName;
                    return dto;
                }
                ).ToList());
        }

        [AbpAuthorize(AppPermissions.Pages_CMS_Contents_Move)]
        public async Task<GoodDto> MoveGood(MoveGoodInput input)
        {
            if (input.NewChannelId.HasValue)
                await _goodManager.MoveAsync(input.Id, input.NewChannelId.Value);
            var good = await _goodManager.GoodRepository.GetAsync(input.Id);
            return good.MapTo<GoodDto>();
        }


        [AbpAuthorize(AppPermissions.Pages_CMS_Contents_Edit)]
        public async Task<GoodDto> UpdateGood(UpdateGoodInput input)
        {
            var good = await _goodManager.GoodRepository.GetAsync(input.Id);
            var app = await _appManager.GetByIdAsync(good.AppId);
            good.Title = input.Title;
            good.ContentText = input.ContentText;
            good.CheckedLevel = input.CheckedLevel;
            good.Comments = input.Comments;
            good.ContentGroupNameCollection = input.ContentGroupNameCollection;
            good.FileUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
            good.Hits = input.Hits;
            good.HitsByDay = input.HitsByDay;
            good.HitsByMonth = input.HitsByMonth;
            good.HitsByWeek = input.HitsByWeek;
            good.ImageUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
            good.IsChecked = input.IsChecked;
            good.IsColor = input.IsColor;
            good.IsHot = input.IsHot;
            good.IsRecommend = input.IsRecommend;
            good.IsTop = input.IsTop;
            good.VideoUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);

            await _goodManager.UpdateAsync(good);

            await CurrentUnitOfWork.SaveChangesAsync();
            return good.MapTo<GoodDto>();
        }

        /// <summary>
        /// 获取内容信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<GoodDto> GetGood(IdInput<long> input)
        {
            var good = await _goodManager.GoodRepository.GetAsync(input.Id);
            var app = await _appManager.GetByIdAsync(good.AppId);
            if (!string.IsNullOrEmpty(good.ImageUrl))
            {
                good.ImageUrl = PageUtils.GetUrlWithAppDir(app, good.ImageUrl);
            }
            if (!string.IsNullOrEmpty(good.VideoUrl))
            {
                good.VideoUrl = PageUtils.GetUrlWithAppDir(app, good.VideoUrl);
            }
            if (!string.IsNullOrEmpty(good.FileUrl))
            {
                good.FileUrl = PageUtils.GetUrlWithAppDir(app, good.FileUrl);
            }
            return good.MapTo<GoodDto>();
        }
    }
}
