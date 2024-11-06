using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public class LoggingHandler : DelegatingHandler
    {

        public LoggingHandler(HttpMessageHandler innerHandler)
            : base(innerHandler)
        {
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {

            Tracer.Instance.TraceInformation(request.ToString());
            if (request.Content != null)
            {
                Tracer.Instance.TraceInformation(await request.Content.ReadAsStringAsync());
            }
            
            HttpResponseMessage response = await base.SendAsync(request, cancellationToken);

            //System.Diagnostics.Trace.WriteLine("Response:");
            //System.Diagnostics.Trace.WriteLine(response.ToString());
            Tracer.Instance.TraceInformation(response.ToString());
            if (response.Content != null)
            {
                Tracer.Instance.TraceInformation(await response.Content.ReadAsStringAsync());
            }

            return response;
        }
    }
}
