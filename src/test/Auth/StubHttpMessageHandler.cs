using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Tests.Auth
{
    /// <summary>
    /// Eenvoudige HttpMessageHandler-stub die elke request afhandelt via een meegegeven functie
    /// en het aantal aanroepen bijhoudt. Voor unit tests zonder echte netwerk-calls.
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
