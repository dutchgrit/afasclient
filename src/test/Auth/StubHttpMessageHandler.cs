using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Tests.Auth
{
    /// <summary>
    /// Simple HttpMessageHandler stub that handles every request via a supplied function
    /// and tracks the number of calls. For unit tests without real network calls.
    /// </summary>
    public class StubHttpMessageHandler : HttpMessageHandler
    {
        private readonly Func<HttpRequestMessage, HttpResponseMessage> responder;

        public int CallCount { get; private set; }

        public HttpRequestMessage LastRequest { get; private set; }

        public StubHttpMessageHandler(Func<HttpRequestMessage, HttpResponseMessage> responder)
        {
            this.responder = responder;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            this.CallCount++;
            this.LastRequest = request;
            return Task.FromResult(this.responder(request));
        }
    }
}
