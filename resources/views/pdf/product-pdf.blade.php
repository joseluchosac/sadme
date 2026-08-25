<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Producto - {{ $product->name }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #000;
            margin: 0;
            padding: 20px;
        }

        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 18pt;
            margin: 0 0 5px 0;
            color: #1a1a1a;
        }

        .header .subtitle {
            font-size: 9pt;
            color: #666;
        }

        .info-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .info-grid td {
            padding: 5px 8px;
            border: 1px solid #ddd;
            font-size: 9pt;
            vertical-align: top;
        }

        .info-grid .label {
            background-color: #f5f5f5;
            font-weight: bold;
            width: 25%;
            color: #333;
        }

        .info-grid .value {
            color: #000;
        }

        .section-title {
            font-size: 12pt;
            font-weight: bold;
            color: #1a1a1a;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin: 20px 0 10px 0;
        }

        .details-box {
            box-sizing: border-box;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #fff;
        }

        /* Estilos para el contenido HTML del editor Quill */
        .details-box p {
            margin-top: 0;
            margin-bottom: 1em;
            line-height: 1.5;
        }

        .details-box p:last-child {
            margin-bottom: 0;
        }

        .details-box h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 10px 0 8px 0;
            line-height: 1.2;
        }

        .details-box h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 8px 0 6px 0;
            line-height: 1.2;
        }

        .details-box h3 {
            font-size: 12pt;
            font-weight: bold;
            margin: 6px 0 5px 0;
            line-height: 1.2;
        }

        .details-box h4 {
            font-size: 10pt;
            font-weight: bold;
            margin: 5px 0 4px 0;
            line-height: 1.2;
        }

        .details-box ul {
            margin: 8px 0;
            padding-left: 25px;
        }

        .details-box ol {
            margin: 8px 0;
            padding-left: 25px;
        }

        .details-box li {
            margin-bottom: 3px;
            line-height: 1.5;
        }

        .details-box a {
            color: #06c;
            text-decoration: underline;
        }

        .details-box strong {
            font-weight: bold;
        }

        .details-box em {
            font-style: italic;
        }

        .details-box u {
            text-decoration: underline;
        }

        .details-box s {
            text-decoration: line-through;
        }

        .details-box blockquote {
            margin: 10px 30px;
            font-style: italic;
            color: #555;
            border-left: 3px solid #ccc;
            padding-left: 10px;
        }

        .details-box pre {
            font-family: 'Courier New', monospace;
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            padding: 8px 12px;
            margin: 8px 0;
            font-size: 8pt;
            white-space: pre-wrap;
        }

        .details-box code {
            font-family: 'Courier New', monospace;
            background-color: #f0f0f0;
            padding: 1px 4px;
            font-size: 8pt;
        }

        .details-box img {
            max-width: 100%;
        }

        .details-box table {
            border-collapse: collapse;
            width: 100%;
            margin: 8px 0;
        }

        .details-box th,
        .details-box td {
            /* border: 1px solid #ccc; */
            padding: 5px 8px;
            text-align: left;
            font-size: 9pt;
        }

        .details-box th {
            font-weight: bold;
            background-color: #f5f5f5;
        }

        /* Clases de margin-bottom del editor Quill */
        .details-box .mb-0 { margin-bottom: 0; }
        .details-box .mb-05em { margin-bottom: 0.5em; }
        .details-box .mb-1em { margin-bottom: 1em; }
        .details-box .mb-15em { margin-bottom: 1.5em; }
        .details-box .mb-2em { margin-bottom: 2em; }
        .details-box .mb-3em { margin-bottom: 3em; }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 8px;
            font-size: 8pt;
            color: #999;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>{{ $product->name }}</h1>
        <div class="subtitle">Ficha del Producto</div>
    </div>

    <table class="info-grid">
        <tr>
            <td class="label">Código</td>
            <td class="value">{{ $product->code }}</td>
            <td class="label">Nombre</td>
            <td class="value">{{ $product->name }}</td>
        </tr>
        <tr>
            <td class="label">Categoría</td>
            <td class="value">{{ $product->category->name ?? '-' }}</td>
            <td class="label">Unidad</td>
            <td class="value">{{ $product->unit->name ?? '-' }} ({{ $product->unit_code }})</td>
        </tr>
        <tr>
            <td class="label">Precio</td>
            <td class="value">S/ {{ number_format($product->price, 2) }}</td>
            <td class="label">Stock Mínimo</td>
            <td class="value">{{ $product->min_stock }}</td>
        </tr>
        <tr>
            <td class="label">Marca</td>
            <td class="value">{{ $product->brand ?? '-' }}</td>
            <td class="label">Código de Barras</td>
            <td class="value">{{ $product->barcode ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Estado</td>
            <td class="value">{{ $product->status ? 'Activo' : 'Inactivo' }}</td>
            <td class="label">Descripción</td>
            <td class="value">{{ $product->description ?? '-' }}</td>
        </tr>
    </table>

    @if(!empty($detailsHtml))
        <div class="section-title">Detalles</div>
        <div class="details-box">
            {!! $detailsHtml !!}
        </div>
    @endif

    <div class="footer">
        Generado el {{ now()->format('d/m/Y H:i') }}
    </div>
</body>

</html>
