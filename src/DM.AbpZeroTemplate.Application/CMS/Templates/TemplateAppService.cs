using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Templates.Dto;
using Abp.Templates;
using Abp.AutoMapper;
using Abp.Channels;
using System.Data.Entity;
using Abp.Linq.Extensions;
using Abp.Apps;
using Abp.CMS;

namespace DM.AbpZeroTemplate.CMS.Templates
{
    public class TemplateAppService : AbpZeroTemplateServiceBase, ITemplateAppService
    {
        private readonly TemplateManager _templateManager;
        private readonly ChannelManager _channelManager;
        private readonly AppManager _appManager;

        public TemplateAppService(
            TemplateManager templateManager,
            ChannelManager channelManager,
            AppManager appManager
            )
        {
            _templateManager = templateManager;
            _channelManager = channelManager;
            _appManager = appManager;
        }

        public async Task<TemplateDto> CreateTemplate(CreateTemplateInput input)
        {
            if (string.IsNullOrEmpty(input.Extension))
                input.Extension = Template.DefaultExtension;

            var template = new Template(input.AppId, input.Title, input.Name, input.Type, input.Extension, false);
            template.TemplateContent = input.TemplateContent;
            await _templateManager.CreateAsync(template);
            await CurrentUnitOfWork.SaveChangesAsync();

            return template.MapTo<TemplateDto>();
        }

        public async Task DeleteTemplate(IdInput<long> input)
        {
            await _templateManager.DeleteAsync(input.Id);
        }

        public async Task<PagedResultOutput<GetAppTemplateDto>> GetTemplates(GetAppTemplateInput input)
        {
            var channelId = input.Id;
            if (!string.IsNullOrEmpty(input.Type))
            {
                var query = from t in _templateManager.TemplateRepository.GetAll()
                            join a in _appManager.AppRepository.GetAll() on t.AppId equals a.Id
                            where t.AppId == input.Id && t.Type == input.Type
                            orderby input.Sorting
                            select new { t, a };
                var totalCount = await query.CountAsync();
                var items = await query.PageBy(input).ToListAsync();
                return new PagedResultOutput<GetAppTemplateDto>(
                    totalCount,
                    items.Select(
                    item =>
                    {
                        var dto = item.t.MapTo<GetAppTemplateDto>();
                        dto.AppName = item.a.DisplayName;
                        return dto;
                    }
                    ).ToList());
            }
            else
            {
                var query = from t in _templateManager.TemplateRepository.GetAll()
                            join a in _appManager.AppRepository.GetAll() on t.AppId equals a.Id
                            where t.AppId == input.Id
                            orderby input.Sorting
                            select new { t, a };
                var totalCount = await query.CountAsync();
                var items = await query.PageBy(input).ToListAsync();
                return new PagedResultOutput<GetAppTemplateDto>(
                    totalCount,
                    items.Select(
                    item =>
                    {
                        var dto = item.t.MapTo<GetAppTemplateDto>();
                        dto.AppName = item.a.DisplayName;
                        return dto;
                    }
                    ).ToList());
            }

        }


        public async Task<TemplateDto> UpdateTemplate(UpdateTemplateInput input)
        {
            var template = await _templateManager.TemplateRepository.GetAsync(input.Id);
            template.Title = input.Title;
            template.Name = input.Name;
            template.Type = input.Type;
            template.Extension = input.Extension;
            template.TemplateContent = input.TemplateContent;
            await _templateManager.UpdateAsync(template);

            await CurrentUnitOfWork.SaveChangesAsync();
            return template.MapTo<TemplateDto>();
        }


        public async Task<string> GetTemplateContent(IdInput<long> input)
        {
            var template = await _templateManager.TemplateRepository.GetAsync(input.Id);
            if (template != null)
            {
                return _templateManager.GetTemplateContent(template);
            }
            return string.Empty;
        }
    }
}
