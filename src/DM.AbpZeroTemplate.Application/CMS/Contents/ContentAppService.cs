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

namespace DM.AbpZeroTemplate.CMS.Contents
{
    public class ContentAppService : AbpZeroTemplateServiceBase, IContentAppService
    {
        private readonly ContentManager _contentManager;
        private readonly ChannelManager _channelManager;
        private readonly AppManager _appManager;

        public ContentAppService(
            ContentManager contentManager,
            ChannelManager channelManager,
            AppManager appManager
            )
        {
            _contentManager = contentManager;
            _channelManager = channelManager;
            _appManager = appManager;
        }

        public async Task<ContentDto> CreateContent(CreateContentInput input)
        {
            var content = new Content(input.AppId, input.ChannelId, input.Title, input.ContentText);
            await _contentManager.CreateAsync(content);
            await CurrentUnitOfWork.SaveChangesAsync();
            return content.MapTo<ContentDto>();
        }

        public async Task DeleteContent(IdInput<long> input)
        {
            await _contentManager.DeleteAsync(input.Id);
        }

        public async Task<PagedResultOutput<GetChannelContentDto>> GetContents(GetChannelContentsInput input)
        {
            var channelId = input.Id;
            var query = from con in _contentManager.ContentRepository.GetAll()
                        join ch in _channelManager.ChannelRepository.GetAll() on con.ChannelId equals ch.Id
                        join a in _appManager.AppRepository.GetAll() on ch.AppId equals a.Id
                        where con.ChannelId == input.Id
                        orderby input.Sorting
                        select new { con, ch, a };
            var totalCount = await query.CountAsync();
            var items = await query.PageBy(input).ToListAsync();
            return new PagedResultOutput<GetChannelContentDto>(
                totalCount,
                items.Select(
                item =>
                {
                    var dto = item.con.MapTo<GetChannelContentDto>();
                    dto.AppName = item.a.DisplayName;
                    dto.ChannelName = item.ch.DisplayName;
                    return dto;
                }
                ).ToList());
        }

        public async Task<ContentDto> MoveContent(MoveContentInput input)
        {
            if (input.NewChannelId.HasValue)
                await _contentManager.MoveAsync(input.Id, input.NewChannelId.Value);
            var content = await _contentManager.ContentRepository.GetAsync(input.Id);
            return content.MapTo<ContentDto>();
        }

        public async Task<ContentDto> UpdateContent(UpdateContentInput input)
        {
            var content = await _contentManager.ContentRepository.GetAsync(input.Id);
            content.Title = input.Title;
            content.ContentText = input.ContentText;

            await _contentManager.UpdateAsync(content);

            await CurrentUnitOfWork.SaveChangesAsync();
            return content.MapTo<ContentDto>();
        }
    }
}
